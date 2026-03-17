import { TreeNode, ParseResult, NodeRelationship } from '../types/tree.types';

/**
 * TreeParser - Parses string input into tree data structures
 * 
 * Syntax:
 * - `>` separates parent from children
 * - `,` separates siblings
 * - `;` separates multiple statements
 * 
 * Example: "A > B, C; B > D" creates a tree where A has children B and C, and B has child D
 */
export class TreeParser {
  private nodeMap: Map<string, TreeNode> = new Map();
  private parentChildMap: Map<string, Set<string>> = new Map();
  private childParentMap: Map<string, string> = new Map();

  /**
   * Parse input string into a tree structure
   * @param input - String representation of tree relationships
   * @returns ParseResult with tree or error message
   */
  parse(input: string): ParseResult {
    this.reset();

    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return { success: false, error: 'Input cannot be empty' };
    }

    const statements = trimmedInput.split(';').map(s => s.trim()).filter(s => s);

    for (const statement of statements) {
      const result = this.parseStatement(statement);
      if (!result.success) {
        return result;
      }
    }

    const roots = this.findRoots();
    if (roots.length === 0) {
      return { success: false, error: 'No root node found' };
    }

    if (roots.length > 1) {
      return { success: true, tree: roots[0] };
    }

    return { success: true, tree: roots[0] };
  }

  private reset(): void {
    this.nodeMap.clear();
    this.parentChildMap.clear();
    this.childParentMap.clear();
  }

  /**
   * Parse a single statement (e.g., "A > B, C")
   * @param statement - Single tree relationship statement
   * @returns ParseResult indicating success or failure
   */
  private parseStatement(statement: string): ParseResult {
    const parts = statement.split('>').map(p => p.trim());

    if (parts.length < 2) {
      return { success: false, error: 'Invalid statement format' };
    }

    let currentParent = parts[0];

    if (!currentParent) {
      return { success: false, error: 'Parent node cannot be empty' };
    }

    for (let i = 1; i < parts.length; i++) {
      const childrenStr = parts[i];
      const children = childrenStr.split(',').map(c => c.trim()).filter(c => c);

      if (children.length === 0) {
        return { success: false, error: 'Child node cannot be empty' };
      }

      for (const child of children) {
        const validationResult = this.validateAndAddRelationship(currentParent, child);
        if (!validationResult.success) {
          return validationResult;
        }
      }

      if (i < parts.length - 1) {
        currentParent = children[0];
      }
    }

    return { success: true };
  }

  /**
   * Validate and add a parent-child relationship
   * Checks for cycles, self-references, and multiple parents
   * @param parent - Parent node ID
   * @param child - Child node ID
   * @returns ParseResult indicating if relationship is valid
   */
  private validateAndAddRelationship(parent: string, child: string): ParseResult {
    if (parent === child) {
      return { success: false, error: `Node cannot be parent of itself: ${parent}` };
    }

    const existingParent = this.childParentMap.get(child);
    if (existingParent && existingParent !== parent) {
      return { success: false, error: `Node ${child} already has parent ${existingParent}` };
    }

    if (this.hasCycle(parent, child)) {
      return { success: false, error: `Adding ${parent} → ${child} would create a cycle` };
    }

    this.addRelationship(parent, child);
    return { success: true };
  }

  /**
   * Check if adding this relationship would create a cycle
   * @param parent - Parent node ID
   * @param child - Child node ID
   * @returns true if cycle would be created
   */
  private hasCycle(parent: string, child: string): boolean {
    const visited = new Set<string>();
    const queue: string[] = [child];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current === parent) {
        return true;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const children = this.parentChildMap.get(current);
      if (children) {
        queue.push(...children);
      }
    }

    return false;
  }

  private addRelationship(parent: string, child: string): void {
    if (!this.nodeMap.has(parent)) {
      this.nodeMap.set(parent, { id: parent, children: [] });
    }
    if (!this.nodeMap.has(child)) {
      this.nodeMap.set(child, { id: child, children: [] });
    }

    if (!this.parentChildMap.has(parent)) {
      this.parentChildMap.set(parent, new Set());
    }
    this.parentChildMap.get(parent)!.add(child);

    this.childParentMap.set(child, parent);
  }

  /**
   * Find all root nodes (nodes with no parents)
   * @returns Array of root TreeNode objects
   */
  private findRoots(): TreeNode[] {
    const roots: TreeNode[] = [];

    for (const [nodeId] of this.nodeMap) {
      if (!this.childParentMap.has(nodeId)) {
        const tree = this.buildTree(nodeId);
        roots.push(tree);
      }
    }

    return roots;
  }

  private buildTree(nodeId: string): TreeNode {
    const node: TreeNode = { id: nodeId, children: [] };
    const children = this.parentChildMap.get(nodeId);

    if (children) {
      const childArray = Array.from(children);
      node.children = childArray.map(childId => this.buildTree(childId));
    }

    return node;
  }
}
