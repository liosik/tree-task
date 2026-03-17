import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TreeView } from './components/TreeView';
import { TreeParser } from './utils/treeParser';
import { ParseResult } from './types/tree.types';

export default function App() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleBuildTree = () => {
    const parser = new TreeParser();
    const parseResult = parser.parse(input);
    setResult(parseResult);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tree Builder</Text>
          <Text style={styles.subtitle}>
            Use &gt; for parent-child, , for siblings, ; for new statements
          </Text>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder='Enter tree structure (e.g., "A > B, C")'
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleBuildTree}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Build Tree</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.resultSection}
          contentContainerStyle={styles.resultContent}
        >
          {result && (
            <View style={styles.resultContainer}>
              {result.success && result.tree ? (
                <View style={styles.treeContainer}>
                  <TreeView node={result.tree} />
                </View>
              ) : (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Invalid!</Text>
                  <Text style={styles.errorText}>{result.error}</Text>
                </View>
              )}
            </View>
          )}

          {!result && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                Enter a tree structure and press "Build Tree"
              </Text>
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Examples:</Text>
                <Text style={styles.exampleText}>• A &gt; B, C</Text>
                <Text style={styles.exampleText}>• A &gt; B &gt; C, D; A &gt; E</Text>
                <Text style={styles.exampleText}>• A &gt; B; A &gt; B</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultSection: {
    flex: 1,
  },
  resultContent: {
    padding: 20,
    alignItems: 'center',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  treeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    height: 400,
    overflow: 'hidden',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF5350',
    width: '100%',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
    marginBottom: 30,
  },
  examplesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
