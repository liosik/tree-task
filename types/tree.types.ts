export interface TreeNode {
  id: string;
  children: TreeNode[];
}

export interface ParseResult {
  success: boolean;
  tree?: TreeNode;
  error?: string;
}

export interface NodeRelationship {
  parent: string;
  children: string[];
}
