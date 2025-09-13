import React, {useRef, useState, forwardRef} from 'react';
import {View, Button, StyleSheet, Pressable, ColorValue} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export type Point = {x: number; y: number};
export type Stroke = {points: Point[]};

function pointsToSvgPath(points: Point[]) {
    if (!points.length) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
}

const FingerDrawing = () => {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const colourSelection = ["black", "white", "red", "green", "blue", "magenta", "yellow"];
    const [selectedColour, setSelectedColour] = useState("black");
    const [strokeColours, setStrokeColours] = useState<ColorValue[]>([]);
    const [svgString, setSvgString] = useState<string>('');
    const currentStroke = useRef<Point[]>([]);

    const handleTouchStart = (evt: any) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentStroke.current = [{ x: locationX, y: locationY }];
        setStrokes(prev => [...prev, { points: currentStroke.current }]);
        setStrokeColours(prev => [...prev, selectedColour]);
    };

    const handleTouchMove = (evt: any) => {
        const {locationX, locationY} = evt.nativeEvent;
        currentStroke.current.push({x: locationX, y: locationY});
        setStrokes(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = {points: [...currentStroke.current]};
            return copy;
        });
    };

    const resetDrawing = () => {
        setStrokes([]);
        setStrokeColours([]);
        setSvgString('');
        currentStroke.current = [];
    }

    const undoLastStroke = () => {
        setStrokes(prev => prev.slice(0, -1));
        setStrokeColours(prev => prev.slice(0, -1));
        currentStroke.current = [];
    }

    const exportSvg = () => {
        const paths = strokes
            .map((s, ind) => `<path d="${pointsToSvgPath(s.points)}" stroke="${String(strokeColours[ind])}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`)
            .join('');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">${paths}</svg>`;
        setSvgString(svg);
        console.log('SVG Export:', svg);
    };

    return (
        <View style={styles.container}>
            <View
                className="flex flex-row gap-3 pb-[6px]"
            >
                {colourSelection.map((item, idx) => (
                    <Pressable
                        key={idx}
                        className="w-[30px] h-[30px] rounded-[12px] border-[3px]"
                        style={{backgroundColor: item, borderColor: selectedColour === item ? "white": "black"}}
                        onPress={() => {
                            setSelectedColour(item);
                        }}
                    >
                    </Pressable>
                ))}
            </View>
            <View
                style={styles.drawingArea}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleTouchStart}
                onResponderMove={handleTouchMove}
            >
                <Svg style={StyleSheet.absoluteFill}>
                    {strokes.map((s, idx) => (
                        <Path
                            key={idx}
                            d={pointsToSvgPath(s.points)}
                            stroke={strokeColours[idx]}
                            strokeWidth={6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    ))}
                </Svg>
            </View>
            <Button title="Undo" onPress={undoLastStroke} />
            <Button title="Reset" onPress={resetDrawing} />
            <Button title="Export SVG" onPress={exportSvg} />
        </View>
    );
};

export default FingerDrawing;

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    drawingArea: {
        width: 300,
        height: 300,
        backgroundColor: 'rgba(52, 52, 52, 0.2)',
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

/*
Usage example:

import React from 'react';
import {SafeAreaView} from 'react-native';
import FingerDrawing from './FingerDrawing';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FingerDrawing />
    </SafeAreaView>
  );
}
*/