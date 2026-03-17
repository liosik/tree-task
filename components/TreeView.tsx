import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { TreeNode } from '../types/tree.types';

interface TreeViewProps {
  node: TreeNode;
}

interface PositionedNode {
  node: TreeNode;
  x: number;
  y: number;
  level: number;
}

const NODE_WIDTH = 80;
const NODE_HEIGHT = 50;
const LEVEL_HEIGHT = 100;
const SIBLING_GAP = 50;
const PADDING = 40;
const MIN_SCALE = 0.3;
const MAX_SCALE = 2;

export const TreeView: React.FC<TreeViewProps> = ({ node }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const maxWidth = screenWidth - PADDING * 2;
  const maxHeight = screenHeight * 0.6;

  const { positionedNodes, lines, width, height, initialScale } = useMemo(() => {
    const positioned: PositionedNode[] = [];
    const lineData: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    const calculateWidth = (n: TreeNode): number => {
      if (n.children.length === 0) return NODE_WIDTH + SIBLING_GAP;
      return n.children.reduce((sum, child) => sum + calculateWidth(child), 0);
    };

    const positionNodes = (
      n: TreeNode,
      x: number,
      y: number,
      level: number
    ): number => {
      const nodeWidth = calculateWidth(n);
      const nodeX = x + nodeWidth / 2 - NODE_WIDTH / 2;
      const nodeY = y;

      positioned.push({ node: n, x: nodeX, y: nodeY, level });

      if (n.children.length > 0) {
        let childX = x;
        const childY = y + LEVEL_HEIGHT;

        n.children.forEach((child) => {
          const childWidth = calculateWidth(child);
          const childCenterX = positionNodes(child, childX, childY, level + 1);

          lineData.push({
            x1: nodeX + NODE_WIDTH / 2,
            y1: nodeY + NODE_HEIGHT,
            x2: childCenterX,
            y2: childY,
          });

          childX += childWidth;
        });
      }

      return nodeX + NODE_WIDTH / 2;
    };

    const treeWidth = calculateWidth(node);
    positionNodes(node, 0, 20, 0);

    const maxY = Math.max(...positioned.map((p) => p.y)) + NODE_HEIGHT + 20;

    const scaleX = treeWidth > maxWidth ? maxWidth / treeWidth : 1;
    const scaleY = maxY > maxHeight ? maxHeight / maxY : 1;
    const calculatedScale = Math.min(scaleX, scaleY, 1);

    return {
      positionedNodes: positioned,
      lines: lineData,
      width: treeWidth,
      height: maxY,
      initialScale: calculatedScale,
    };
  }, [node, maxWidth, maxHeight, screenWidth]);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = 0;
    savedTranslateX.value = 0;
    translateY.value = 0;
    savedTranslateY.value = 0;
    scale.value = 1;
    savedScale.value = 1;
  }, [node]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * initialScale },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View 
          style={[
            styles.treeContainer,
            animatedStyle
          ]}
        >
            <Svg width={width} height={height} style={styles.svg}>
              {lines.map((line, index) => (
                <Line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#555"
                  strokeWidth="3"
                />
              ))}
            </Svg>

            {positionedNodes.map((positioned, index) => (
              <View
                key={`${positioned.node.id}-${index}`}
                style={[
                  styles.nodeBox,
                  positioned.level === 0 && styles.rootNode,
                  {
                    position: 'absolute',
                    left: positioned.x,
                    top: positioned.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                  },
                ]}
              >
                <Text style={styles.nodeText}>{positioned.node.id}</Text>
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  treeContainer: {
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nodeBox: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#3A7BC8',
  },
  rootNode: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  nodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
