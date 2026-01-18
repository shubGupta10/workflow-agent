export function buildPlanningPrompt(input: {
    repoSummary: any;
    action: string;
    userInput?: string;
}) {
    // Extract technology stack information with safe fallbacks
    const frameworks = input.repoSummary.frameworks || [];
    const database = input.repoSummary.database;
    const patterns = input.repoSummary.patterns || {};
    const dependencies = input.repoSummary.dependencies || {};

    // Determine backend, frontend, and fullstack frameworks
    const backendFrameworks = frameworks.filter((f: any) => f.type === 'backend').map((f: any) => f.name);
    const frontendFrameworks = frameworks.filter((f: any) => f.type === 'frontend').map((f: any) => f.name);
    const fullstackFrameworks = frameworks.filter((f: any) => f.type === 'fullstack').map((f: any) => f.name);

    // Detect if this is an unknown/minimal repository
    const hasNoFrameworks = backendFrameworks.length === 0 && frontendFrameworks.length === 0 && fullstackFrameworks.length === 0;
    const hasNoDatabase = !database;
    const hasNoPatterns = (!patterns.models || patterns.models.length === 0) &&
        (!patterns.services || patterns.services.length === 0);
    const isUnknownRepo = hasNoFrameworks && hasNoDatabase && hasNoPatterns;

    // Build technology stack section
    const techStackSection = `
====================================
TECHNOLOGY STACK (MANDATORY)
====================================
This repository uses the following technologies. You MUST use these and ONLY these:

${backendFrameworks.length > 0 ? `Backend Framework(s): ${backendFrameworks.join(', ')}` : ''}
${fullstackFrameworks.length > 0 ? `Full-Stack Framework(s): ${fullstackFrameworks.join(', ')} (includes both frontend and backend)` : ''}
${frontendFrameworks.length > 0 ? `Frontend Framework(s): ${frontendFrameworks.join(', ')}` : ''}
${hasNoFrameworks ? 'Frameworks: NONE DETECTED' : ''}
${database ? `Database: ${database.type} with ${database.orm} ${database.orm !== 'none' ? 'ODM/ORM' : '(direct driver)'}` : 'Database: NONE DETECTED'}
Package Manager: ${input.repoSummary.packageManager || 'unknown'}
Languages: ${input.repoSummary.languages?.join(', ') || 'unknown'}

${isUnknownRepo ? `
[CRITICAL] INSUFFICIENT REPOSITORY INFORMATION DETECTED

This repository has minimal or no detectable frameworks, databases, or code patterns.

YOU ARE ABSOLUTELY FORBIDDEN FROM:
- Assuming ANY framework (Next.js, Express, React, Vue, Django, Flask, etc.)
- Assuming ANY database (MongoDB, PostgreSQL, MySQL, etc.)
- Assuming ANY ORM (Prisma, Mongoose, TypeORM, Sequelize, etc.)
- Creating files based on assumptions
- Suggesting technology installations without evidence

YOU MUST INSTEAD:
1. STOP and ask the user to clarify the technology stack
2. Ask specific questions about:
   - What framework/runtime is being used?
   - What database (if any) is being used?
   - What is the project structure?
   - Are there existing patterns to follow?
3. Wait for user confirmation before proceeding with any plan

DO NOT PROCEED WITH A PLAN. ASK FOR CLARIFICATION FIRST.
` : ''}

${database && database.orm === 'Mongoose' ? `
[CRITICAL] This project uses MongoDB with Mongoose ODM.
- DO NOT suggest Prisma, TypeORM, Sequelize, or any SQL ORM
- DO NOT create prisma/schema.prisma files
- ONLY use Mongoose models and schemas
` : ''}

${database && database.orm === 'Prisma' ? `
[CRITICAL] This project uses Prisma ORM.
- DO NOT suggest Mongoose, TypeORM, Sequelize, or other ORMs
- Use Prisma schema and migrations
- Follow Prisma best practices
` : ''}

${backendFrameworks.includes('Express') && frontendFrameworks.includes('Next.js') ? `
[CRITICAL] This is a DECOUPLED architecture:
- Backend: Express.js (standalone server, separate codebase)
- Frontend: Next.js (client-side only, separate codebase)
- DO NOT create Next.js API routes (app/api/* or pages/api/*)
- ONLY create Express routes in the backend
` : ''}

${fullstackFrameworks.includes('Next.js') ? `
[CRITICAL] This is a Next.js FULL-STACK application:
- Next.js handles both frontend and backend (API routes)
- Create API routes in app/api/* or pages/api/*
- DO NOT suggest separate Express server
- Use Next.js API route patterns
` : ''}

${!isUnknownRepo ? `
Installed Dependencies:
${dependencies.core && dependencies.core.length > 0 ? `- Core: ${dependencies.core.join(', ')}` : ''}
${dependencies.database && dependencies.database.length > 0 ? `- Database: ${dependencies.database.join(', ')}` : ''}
${dependencies.framework && dependencies.framework.length > 0 ? `- Framework: ${dependencies.framework.join(', ')}` : ''}
` : ''}
`;

    // Build forbidden actions section
    const forbiddenActionsSection = `
====================================
FORBIDDEN ACTIONS (CRITICAL)
====================================
You are ABSOLUTELY FORBIDDEN from suggesting:

${database && database.orm === 'Mongoose' ? `
[FORBIDDEN] Database Layer:
   - Prisma or any Prisma-related code
   - Creating prisma/schema.prisma files
   - SQL databases or SQL ORMs (TypeORM, Sequelize)
   - Database migration files
   [REQUIRED] ONLY use Mongoose models and MongoDB operations
` : ''}

${database && database.orm === 'Prisma' ? `
[FORBIDDEN] Database Layer:
   - Mongoose or MongoDB-specific code
   - Creating Mongoose schemas
   - Other ORMs (TypeORM, Sequelize)
   [REQUIRED] ONLY use Prisma schema and migrations
` : ''}

${hasNoDatabase ? `
[FORBIDDEN] Database Assumptions:
   - DO NOT assume any database exists
   - DO NOT suggest Prisma, Mongoose, TypeORM, or any ORM
   - DO NOT create database schemas or models
   [REQUIRED] ASK the user what database (if any) they are using
` : ''}

${backendFrameworks.includes('Express') && frontendFrameworks.includes('Next.js') ? `
[FORBIDDEN] API Routes:
   - Next.js API routes (app/api/* or pages/api/*)
   - Mixing frontend and backend code
   - Suggesting frontend-backend coupling
   [REQUIRED] ONLY create Express routes in backend codebase
` : ''}

${fullstackFrameworks.includes('Next.js') ? `
[FORBIDDEN] Backend Separation:
   - Creating separate Express server
   - Suggesting backend frameworks
   [REQUIRED] ONLY use Next.js API routes
` : ''}

${hasNoFrameworks ? `
[FORBIDDEN] Framework Assumptions:
   - DO NOT assume Next.js, Express, React, Vue, or any framework
   - DO NOT create framework-specific files
   - DO NOT suggest installing frameworks without confirmation
   [REQUIRED] ASK the user what framework (if any) they are using
` : ''}

[FORBIDDEN] General Assumptions (ALWAYS APPLIES):
   - Assuming technologies not explicitly detected in the repository
   - Suggesting installation of packages not in dependencies
   - Inventing architectural patterns without evidence
   - Creating files in locations that don't match existing patterns
   - Hallucinating features or capabilities that don't exist
   [REQUIRED] ONLY use technologies already installed and detected

[FORBIDDEN] File Structure Violations:
   - Creating files outside established patterns
   - Inventing new folder structures
   - Ignoring existing module organization
   [REQUIRED] ONLY follow existing file organization patterns

${isUnknownRepo ? `
[FORBIDDEN] PROCEEDING WITHOUT INFORMATION:
   - DO NOT create any plan without user clarification
   - DO NOT assume any technology stack
   - DO NOT invent file structures
   [REQUIRED] STOP and ask the user for clarification about the tech stack
` : ''}
`;

    // Build file organization section
    const fileOrgSection = patterns.models && patterns.models.length > 0 ? `
====================================
FILE ORGANIZATION (REQUIRED)
====================================
This repository follows these file organization patterns:

${patterns.models.length > 0 ? `
Models Pattern (${patterns.models.length} existing):
${patterns.models.slice(0, 3).map((m: string) => `  - ${m}`).join('\n')}
${patterns.models.length > 3 ? `  ... and ${patterns.models.length - 3} more` : ''}
` : ''}

${patterns.services.length > 0 ? `
Services Pattern (${patterns.services.length} existing):
${patterns.services.slice(0, 3).map((s: string) => `  - ${s}`).join('\n')}
${patterns.services.length > 3 ? `  ... and ${patterns.services.length - 3} more` : ''}
` : ''}

${patterns.controllers.length > 0 ? `
Controllers Pattern (${patterns.controllers.length} existing):
${patterns.controllers.slice(0, 3).map((c: string) => `  - ${c}`).join('\n')}
${patterns.controllers.length > 3 ? `  ... and ${patterns.controllers.length - 3} more` : ''}
` : ''}

${patterns.routes.length > 0 ? `
Routes Pattern (${patterns.routes.length} existing):
${patterns.routes.slice(0, 3).map((r: string) => `  - ${r}`).join('\n')}
${patterns.routes.length > 3 ? `  ... and ${patterns.routes.length - 3} more` : ''}
` : ''}

When creating new features, follow the same naming and location patterns as shown above.
` : '';

    // Build code examples section
    const codeExamplesSection = database && database.orm === 'Mongoose' ? `
====================================
EXISTING CODE PATTERNS (FOLLOW THESE)
====================================

Mongoose Model Pattern:
\`\`\`typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature extends Document {
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

export const Feature = mongoose.model<IFeature>('Feature', featureSchema);
\`\`\`

Service Layer Pattern:
\`\`\`typescript
export const FeatureService = {
  async createFeature(data) {
    const feature = await Feature.create(data);
    return feature;
  },
  
  async getFeature(id) {
    const feature = await Feature.findById(id);
    if (!feature) throw new Error('Feature not found');
    return feature;
  }
};
\`\`\`

${backendFrameworks.includes('Express') ? `
Express Controller Pattern:
\`\`\`typescript
export const createFeature = async (req, res) => {
  try {
    const feature = await FeatureService.createFeature(req.body);
    res.json({ success: true, data: feature });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
\`\`\`
` : ''}

Follow these patterns exactly when suggesting new code.
` : '';

    return `
You are a senior software engineer.

You are NOT allowed to execute commands.
You are allowed to:
- reason
- plan
- write code snippets
- suggest diffs
- explain changes

Your task is to produce a CLEAR, STEP-BY-STEP PLAN.

${techStackSection}

====================================
REPOSITORY CONTEXT
====================================
${JSON.stringify(input.repoSummary, null, 2)}

====================================
USER INTENT
====================================
Action:
${input.action}

User explanation:
${input.userInput ?? "No additional explanation provided."}

${forbiddenActionsSection}

${fileOrgSection}

${codeExamplesSection}

====================================
WHAT YOU MUST DO
====================================
1. Understand the repository and the user's intent.
2. Produce a step-by-step plan to address the request.
3. Each step should clearly state:
   - what needs to be done
   - which files are involved
   - why the step is necessary
4. If helpful, include:
   - code snippets
   - pseudo-diffs
   - examples

====================================
WHAT YOU MUST NOT DO
====================================
- Do NOT run commands
- Do NOT say "I will execute"
- Do NOT assume changes are applied
- Do NOT skip steps
- Do NOT suggest technologies not in the stack above
- Do NOT ignore the forbidden actions listed above

====================================
OUTPUT FORMAT
====================================
Return the plan in the following structure:

PLAN OVERVIEW:
<short summary of the goal>

STEPS:
1. Step title
   - Description
   - Files involved
   - Expected outcome
   - (Optional) Code snippet or diff

2. Step title
   ...

FINAL NOTES:
- Any risks
- Any assumptions
- Anything the user should review before approval
`;
}

export function buildReviewPrompt(input: {
    repoSummary: any;
    diff: string;
    userInput?: string;
}) {
    return `
You are a senior software architect reviewing a Pull Request.

====================================
REPOSITORY CONTEXT
====================================
${JSON.stringify(input.repoSummary, null, 2)}

====================================
THE CODE CHANGES (DIFF)
====================================
${input.diff.slice(0, 15000)} 
(Diff truncated if too long)

====================================
USER NOTES
====================================
${input.userInput || "No specific instructions."}

====================================
YOUR TASK
====================================
Review the code changes above. Focus on:
1. Bugs or Logic Errors
2. Security Vulnerabilities
3. Code Style & Best Practices
4. Performance Issues

Produce a concise, constructive code review.
`;
}