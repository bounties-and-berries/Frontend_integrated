import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const CardSkeleton: React.FC = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View style={[styles.skeleton, { opacity }]}>
            <View style={styles.line} />
            <View style={[styles.line, styles.mediumLine]} />
            <View style={[styles.line, styles.shortLine]} />
        </Animated.View>
    );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        marginBottom: 12,
    },
    line: {
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 8,
    },
    mediumLine: {
        width: '80%',
    },
    shortLine: {
        width: '60%',
    },
});
