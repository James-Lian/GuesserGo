import {View, Text} from "react-native";

export default function GameUI(score: number, timer: number, opponents: number, kmRadius: number) {
    // game ui: score, timer, opponent icons (use placeholder right now), km radius
    return (
        <View>
            <Text>Score: {score}</Text>
            <Text>Time Left: {timer}s</Text>
            <Text>Opponents: {opponents}</Text>
            <Text>Radius: {kmRadius} km</Text>
        </View>
    )
}