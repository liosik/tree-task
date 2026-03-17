import { TreeParser } from '../treeParser';

describe('TreeParser', () => {
  let parser: TreeParser;

  beforeEach(() => {
    parser = new TreeParser();
  });

  describe('Basic parsing', () => {
    it('should parse simple parent-child relationship', () => {
      const result = parser.parse('A > B');
      expect(result.success).toBe(true);
      expect(result.tree).toBeDefined();
      expect(result.tree?.id).toBe('A');
      expect(result.tree?.children).toHaveLength(1);
      expect(result.tree?.children[0].id).toBe('B');
    });

    it('should parse multiple children', () => {
      const result = parser.parse('A > B, C, D');
      expect(result.success).toBe(true);
      expect(result.tree?.children).toHaveLength(3);
      expect(result.tree?.children.map(c => c.id)).toEqual(['B', 'C', 'D']);
    });

    it('should parse nested relationships', () => {
      const result = parser.parse('A > B > C');
      expect(result.success).toBe(true);
      expect(result.tree?.id).toBe('A');
      expect(result.tree?.children[0].id).toBe('B');
      expect(result.tree?.children[0].children[0].id).toBe('C');
    });

    it('should parse multiple statements separated by semicolon', () => {
      const result = parser.parse('A > B; A > C');
      expect(result.success).toBe(true);
      expect(result.tree?.children).toHaveLength(2);
      expect(result.tree?.children.map(c => c.id)).toEqual(['B', 'C']);
    });
  });

  describe('Validation', () => {
    it('should reject empty input', () => {
      const result = parser.parse('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject whitespace-only input', () => {
      const result = parser.parse('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid format without separator', () => {
      const result = parser.parse('A B C');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty node names', () => {
      const result = parser.parse('A > ');
      expect(result.success).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should detect cycles', () => {
      const result = parser.parse('A > B; B > A');
      expect(result.success).toBe(false);
      expect(result.error).toContain('cycle');
    });

    it('should detect multiple parents for same child', () => {
      const result = parser.parse('A > C; B > C');
      expect(result.success).toBe(false);
      expect(result.error).toContain('already has parent');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle deep nesting', () => {
      const result = parser.parse('A > B > C > D > E');
      expect(result.success).toBe(true);
      let current = result.tree;
      const expectedPath = ['A', 'B', 'C', 'D', 'E'];
      
      for (const expected of expectedPath) {
        expect(current?.id).toBe(expected);
        current = current?.children[0];
      }
    });

    it('should handle wide tree with many siblings', () => {
      const result = parser.parse('A > B, C, D, E, F, G, H');
      expect(result.success).toBe(true);
      expect(result.tree?.children).toHaveLength(7);
    });

    it('should handle mixed depth tree', () => {
      const result = parser.parse('A > B > C, D; A > E');
      expect(result.success).toBe(true);
      expect(result.tree?.children).toHaveLength(2);
      expect(result.tree?.children[0].id).toBe('B');
      expect(result.tree?.children[0].children).toHaveLength(2);
      expect(result.tree?.children[1].id).toBe('E');
    });

    it('should trim whitespace from node names', () => {
      const result = parser.parse('  A  >  B  ,  C  ');
      expect(result.success).toBe(true);
      expect(result.tree?.id).toBe('A');
      expect(result.tree?.children.map(c => c.id)).toEqual(['B', 'C']);
    });
  });

  describe('Edge cases', () => {
    it('should handle single node', () => {
      const result = parser.parse('A');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid statement format');
    });

    it('should handle duplicate relationships', () => {
      const result = parser.parse('A > B; A > B');
      expect(result.success).toBe(true);
      expect(result.tree?.children).toHaveLength(1);
    });

    it('should reject self-referencing node', () => {
      const result = parser.parse('A > A');
      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot be parent of itself');
    });
  });
});
