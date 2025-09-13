// lib/ExpoAROverlay.js
// This is a standalone library-like component that can be imported into any camera screen.
// It only handles AR-like anchoring + projection logic, and overlays an image accordingly.
// It does NOT mount its own Camera — you supply a parent CameraView and mount this overlay above it.

/*
[Unverified] This library approximates AR anchoring with device orientation + accelerometer integration.
It is not a substitute for ARKit/ARCore. Anchors will drift if the user translates significantly.

How to use:
import ExpoAROverlay from '@/lib/ExpoAROverlay';

<CameraView style={{flex:1}} facing={facing}>
  <ExpoAROverlay blobSource={require('@/assets/blob.png')} />
</CameraView>
*/

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Image, Text } from 'react-native';
import { DeviceMotion, Accelerometer } from 'expo-sensors';

const FOV_DEGREES = 60; // assumed vertical FOV [Unverified]
const ANCHOR_INITIAL = { x: 0.0, y: 0.0, z: -2.0 }; // 2m in front of camera
const SMOOTHING = 0.85;

function deg2rad(d) { return d * Math.PI / 180; }

function eulerToRotationMatrix(alpha, beta, gamma) {
    const ca = Math.cos(alpha), sa = Math.sin(alpha);
    const cb = Math.cos(beta), sb = Math.sin(beta);
    const cc = Math.cos(gamma), sc = Math.sin(gamma);

    const r00 = ca * cc + sa * sb * sc;
    const r01 = sa * cb;
    const r02 = ca * -sc + sa * sb * cc;

    const r10 = -sa * cc + ca * sb * sc;
    const r11 = ca * cb;
    const r12 = sa * sc + ca * sb * cc;

    const r20 = cb * sc;
    const r21 = -sb;
    const r22 = cb * cc;

    return [
        [r00, r01, r02],
        [r10, r11, r12],
        [r20, r21, r22],
    ];
}

function rotateVec(mat, v) {
    return {
        x: mat[0][0] * v.x + mat[0][1] * v.y + mat[0][2] * v.z,
        y: mat[1][0] * v.x + mat[1][1] * v.y + mat[1][2] * v.z,
        z: mat[2][0] * v.x + mat[2][1] * v.y + mat[2][2] * v.z,
    };
}

function projectToScreen(v, screenW, screenH, fovDeg) {
    const fov = deg2rad(fovDeg);
    const focal = (screenH / 2) / Math.tan(fov / 2);

    if (v.z >= 0.01) return null;

    const cx = screenW / 2;
    const cy = screenH / 2;
    const x = (focal * v.x / -v.z) + cx;
    const y = (focal * -v.y / -v.z) + cy;
    const scale = focal / -v.z;
    return { x, y, scale };
}

function lerp(a, b, t) { return a + (b - a) * t; }

export default function ExpoAROverlay({ anchor = ANCHOR_INITIAL, blobSource }) {
    const [dm, setDm] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 });
    const [screen, setScreen] = useState(Dimensions.get('window'));

    const projRef = useRef({ x: screen.width / 2, y: screen.height / 2, scale: 1 });
    const animX = useRef(new Animated.Value(screen.width / 2)).current;
    const animY = useRef(new Animated.Value(screen.height / 2)).current;
    const animScale = useRef(new Animated.Value(1)).current;

    const initialOrientationRef = useRef(null);
    const anchorRef = useRef(anchor);
    const cameraPosition = useRef({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        const onDim = () => setScreen(Dimensions.get('window'));
        Dimensions.addEventListener('change', onDim);
        return () => Dimensions.removeEventListener('change', onDim);
    }, []);

    useEffect(() => {
        DeviceMotion.setUpdateInterval(30);
        const sub = DeviceMotion.addListener((dmv) => {
            const rotation = dmv.rotation || dmv.rotationRate || dmv;
            const alpha = rotation.alpha ?? dmv.alpha ?? 0;
            const beta = rotation.beta ?? dmv.beta ?? 0;
            const gamma = rotation.gamma ?? dmv.gamma ?? 0;

            if (!initialOrientationRef.current) {
                initialOrientationRef.current = { alpha, beta, gamma };
            }

            const relAlpha = alpha - (initialOrientationRef.current.alpha ?? 0);
            const relBeta = beta - (initialOrientationRef.current.beta ?? 0);
            const relGamma = gamma - (initialOrientationRef.current.gamma ?? 0);

            setDm({ alpha: relAlpha, beta: relBeta, gamma: relGamma });
        });
        return () => sub && sub.remove();
    }, []);

    useEffect(() => {
        Accelerometer.setUpdateInterval(50);
        const sub = Accelerometer.addListener((av) => {
            const dt = 0.05;
            cameraPosition.current.x += av.x * dt * dt * 0.5;
            cameraPosition.current.y += av.y * dt * dt * 0.5;
            cameraPosition.current.z += av.z * dt * dt * 0.5;
            setAcc({ x: av.x, y: av.y, z: av.z });
        });
        return () => sub && sub.remove();
    }, []);

    useEffect(() => {
        let raf = null;
        function tick() {
            const mat = eulerToRotationMatrix(dm.alpha, dm.beta, dm.gamma);
            const worldAnchor = anchorRef.current;

            const rel = {
                x: worldAnchor.x - cameraPosition.current.x,
                y: worldAnchor.y - cameraPosition.current.y,
                z: worldAnchor.z - cameraPosition.current.z,
            };

            const camSpace = rotateVec(mat, rel);
            const proj = projectToScreen(camSpace, screen.width, screen.height, FOV_DEGREES);

            if (proj) {
                projRef.current.x = lerp(projRef.current.x, proj.x, 1 - SMOOTHING);
                projRef.current.y = lerp(projRef.current.y, proj.y, 1 - SMOOTHING);
                projRef.current.scale = lerp(projRef.current.scale, proj.scale, 1 - SMOOTHING);

                Animated.timing(animX, { toValue: projRef.current.x, duration: 50, useNativeDriver: true }).start();
                Animated.timing(animY, { toValue: projRef.current.y, duration: 50, useNativeDriver: true }).start();
                Animated.timing(animScale, { toValue: projRef.current.scale, duration: 50, useNativeDriver: true }).start();
            }

            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => raf && cancelAnimationFrame(raf);
    }, [dm, screen.width, screen.height]);

    const blob = blobSource || require('../assets/flower.png');

    return (
        <>
            <Animated.View
                style={[
                    styles.anchorWrap,
                    {
                        transform: [
                            { translateX: Animated.subtract(animX, 40) },
                            { translateY: Animated.subtract(animY, 40) },
                            { scale: animScale },
                        ],
                    },
                ]}
                pointerEvents="none"
            >
                <Image source={blob} style={styles.blob} />
            </Animated.View>

            <View style={styles.debug} pointerEvents="none">
                <Text style={styles.debugText}>alpha: {dm.alpha.toFixed(2)}</Text>
                <Text style={styles.debugText}>beta: {dm.beta.toFixed(2)}</Text>
                <Text style={styles.debugText}>gamma: {dm.gamma.toFixed(2)}</Text>
                <Text style={styles.debugText}>acc: {acc.x.toFixed(2)}, {acc.y.toFixed(2)}, {acc.z.toFixed(2)}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    anchorWrap: {
        position: 'absolute',
        width: 80,
        height: 80,
        left: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blob: { width: 80, height: 80, resizeMode: 'contain' },
    debug: { position: 'absolute', left: 10, top: 40, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 8 },
    debugText: { color: '#fff', fontSize: 12 },
});
