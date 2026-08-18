# Agentic Engineering Environment

## Workspace

This workspace contains two distinct planes:

- `governance/` — control plane
- `application/` — execution plane

## Control Plane

The governance directory contains:

- roadmap
- product proposals
- architecture
- ADRs
- specifications
- agent definitions
- skills
- workflows
- engineering rules

These artifacts define how engineering work must be performed.

## Execution Plane

The application directory contains the actual software source code.

All implementation work must target:

./application/

## Mandatory workflow

Before modifying source code:

1. Read relevant governance context.
2. Identify the related feature.
3. Check relevant ADRs.
4. Check architectural constraints.
5. Check the applicable specification.
6. Identify the current task.
7. Implement only within the approved scope.
8. Run tests.
9. Produce evidence.
10. Run the required review/audit.

## Restrictions

Do not modify `application/` based solely on conversational instructions when a governing specification exists.

Do not silently alter ADRs or specifications to make an implementation pass.

If required context is missing, stop and request clarification or update the appropriate governance artifact.
