export interface RoleAssignment {
  role: string;
  component: string;
  props: Record<string, any>;
  validation: boolean;
}

export class RoleAssignmentManager {
  private assignments: Map<string, RoleAssignment> = new Map();

  assignRole(componentId: string, role: string, props: Record<string, any> = {}): RoleAssignment {
    const assignment: RoleAssignment = {
      role,
      component: componentId,
      props,
      validation: this.validateRole(role)
    };

    this.assignments.set(componentId, assignment);
    return assignment;
  }

  getAssignment(componentId: string): RoleAssignment | undefined {
    return this.assignments.get(componentId);
  }

  validateRole(role: string): boolean {
    const validRoles = ['container', 'button', 'text', 'image', 'input', 'none'];
    return validRoles.includes(role);
  }

  getAllAssignments(): RoleAssignment[] {
    return Array.from(this.assignments.values());
  }

  clearAssignments(): void {
    this.assignments.clear();
  }
}

export const roleAssignmentManager = new RoleAssignmentManager(); 