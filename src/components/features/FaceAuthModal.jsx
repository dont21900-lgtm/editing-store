import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../services/firebase';

const FaceAuthModal = ({ user, onClose, onSuccess }) => {
    const [authStep, setAuthStep] = useState('login'); // 'login', 'register-face', 'verify-face'
    const [faceStatus, setFaceStatus] = useState("INITIALIZING...");
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [scanInterval, setScanInterval] = useState(null);

    // Load Face API
    useEffect(() => {
        const loadFaceApi = async () => {
            if (!window.faceapi) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
                script.async = true;
                script.onload = () => loadModels();
                document.body.appendChild(script);
            } else loadModels();
        };

        const loadModels = async () => {
            const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
            try {
                await Promise.all([
                    window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Face API Load Error", err);
                setFaceStatus("ERROR LOADING AI MODELS");
            }
        };
        loadFaceApi();
    }, []);

    // Determine Initial Step
    useEffect(() => {
        const checkUser = async () => {
            if (!user) return;
            setFaceStatus("CHECKING PROFILE...");
            const faceDoc = await getDoc(doc(db, "face_descriptors", user.uid));
            if (!faceDoc.exists()) {
                setAuthStep('register-face');
                setFaceStatus("FACE_ID_MISSING // REGISTER");
            } else {
                setAuthStep('verify-face');
                setFaceStatus("AWAITING_VERIFICATION");
            }
        };
        if (modelsLoaded && user) checkUser();
    }, [user, modelsLoaded]);

    // Camera Control
    const stopCameraStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
    }, []);

    useEffect(() => {
        let isMounted = true;
        const initCamera = async () => {
            if (!modelsLoaded) return;

            // Check for Secure Context (HTTPS or Localhost)
            if (window.isSecureContext === false) {
                setFaceStatus("ERROR: HTTPS REQUIRED FOR CAMERA");
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setFaceStatus("ERROR: CAMERA API NOT SUPPORTED");
                return;
            }

            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: {} });
                if (!isMounted) {
                    s.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = s;
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (e) {
                if (isMounted) {
                    console.error("Camera Error:", e);
                    if (e.name === 'NotAllowedError') {
                        setFaceStatus("ERROR: CAMERA PERMISSION DENIED");
                    } else if (e.name === 'NotFoundError') {
                        setFaceStatus("ERROR: NO CAMERA FOUND");
                    } else {
                        setFaceStatus(`CAMERA ERROR: ${e.name || e.message}`);
                    }
                }
            }
        };
        initCamera();
        return () => {
            isMounted = false;
            stopCameraStream();
        };
    }, [modelsLoaded, stopCameraStream]);

    // Cleanup Interval
    useEffect(() => {
        return () => {
            if (scanInterval) clearInterval(scanInterval);
        };
    }, [scanInterval]);


    const handleRegisterFace = async () => {
        if (!videoRef.current || !modelsLoaded || !user) return;
        setFaceStatus("SCANNING_BIOMETRICS...");

        const interval = setInterval(async () => {
            try {
                if (videoRef.current.paused || videoRef.current.ended || !window.faceapi) return;
                const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                if (detections) {
                    clearInterval(interval);
                    const descriptor = Array.from(detections.descriptor);
                    await setDoc(doc(db, "face_descriptors", user.uid), { descriptor });
                    alert("FACE_ID_REGISTERED");
                    stopCameraStream();
                    onSuccess(); // Grants access
                }
            } catch (error) {
                console.log("Waiting for face...", error);
            }
        }, 500);
        setScanInterval(interval);
    };

    const handleVerifyFace = async () => {
        if (!videoRef.current || !modelsLoaded || !user) return;
        setFaceStatus("VERIFYING_IDENTITY...");

        const interval = setInterval(async () => {
            try {
                if (videoRef.current.paused || videoRef.current.ended || !window.faceapi) return;
                const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                if (detections) {
                    const docRef = doc(db, "face_descriptors", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const savedDescriptor = new Float32Array(docSnap.data().descriptor);
                        const distance = window.faceapi.euclideanDistance(detections.descriptor, savedDescriptor);
                        if (distance < 0.6) {
                            clearInterval(interval);
                            stopCameraStream();
                            setFaceStatus("ACCESS_GRANTED");
                            setTimeout(onSuccess, 500);
                        } else {
                            setFaceStatus("ACCESS_DENIED: MISMATCH");
                        }
                    } else {
                        clearInterval(interval);
                        setFaceStatus("ERROR: ID_NOT_FOUND");
                        setAuthStep('register-face');
                    }
                }
            } catch (e) {
                console.log("Scanning...", e);
            }
        }, 500);
        setScanInterval(interval);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[70] flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md aspect-[3/4] bg-[#050505] border border-white/20 flex flex-col overflow-hidden rounded-lg shadow-2xl">
                {/* Header Badge */}
                <div className="absolute top-4 left-4 z-20 bg-black/80 px-3 py-1 border border-green-500/30 text-[10px] font-mono text-green-400 tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    // FACE_SECURE_PROTOCOL
                </div>

                {/* Video Element */}
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover opacity-90" />

                {/* Scanning Overlay UI */}
                <div className="absolute inset-0 pointer-events-none z-10">
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Central Focus Box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.1)]">
                        {/* Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>

                        {/* Moving Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] animate-scan-y opacity-80"></div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 w-full bg-[#050505] border-t border-white/20 p-6 flex flex-col items-center gap-4 z-20">
                    <p className="text-white font-mono text-xs uppercase tracking-widest text-center">{faceStatus}</p>
                    {authStep === 'register-face' && (
                        <button onClick={handleRegisterFace} className="w-full py-3 bg-[#6500aa] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest transition-colors text-xs border border-transparent">
                            Initialize Face ID
                        </button>
                    )}
                    {authStep === 'verify-face' && (
                        <button onClick={handleVerifyFace} className="w-full py-3 bg-white hover:bg-[#6500aa] hover:text-white text-black font-bold uppercase tracking-widest transition-colors text-xs border border-transparent">
                            Authenticate
                        </button>
                    )}
                    <button onClick={onClose} className="mt-2 text-white/50 hover:text-white text-[10px] uppercase font-bold tracking-widest">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default FaceAuthModal;
