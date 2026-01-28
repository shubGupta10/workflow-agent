export function buildPlanningPrompt(input: {
   repoSummary: any;
   action: string;
   userInput?: string;
}) {
   const tech = input.repoSummary.technologies || {};
   const fileMap = input.repoSummary.fileMap || {};
   const summary = input.repoSummary.summary || {};
   const configs = input.repoSummary.configContents || {};
   const analysis = input.repoSummary.analysis || {};

   const frameworks = tech.frameworks || [];
   const database = tech.database;
   const languages = tech.languages || [];
   const styling = tech.styling || [];
   const uiLibs = tech.uiLibraries || [];
   const stateMgmt = tech.stateManagement || [];

   const isFixMode = input.action.toLowerCase().includes('fix');

   const MODE_RULES =
      isFixMode
         ? `
MODE: FIX AN EXISTING ISSUE (DEBUG MODE)

STRICT RULES:
- DO NOT design new features.
- DO NOT create new routes, components, or flows unless you PROVE they do not exist.
- FIRST investigate the existing implementation.
- Identify the exact failure point.
- Propose the MINIMUM possible fix.
- New files are NOT allowed unless explicitly justified.
`
         : `
MODE: PLAN / IMPLEMENT A CHANGE

RULES:
- You may introduce new files and logic if required.
- Follow existing patterns and structure strictly.
- Prefer extending existing code over creating parallel systems.
`;

   const prompt = `
You are a senior software engineer working inside an existing codebase.

====================================
REPOSITORY CONTEXT
====================================

TECH STACK:
- Languages: ${languages.join(', ') || 'Unknown'}
- Frameworks: ${frameworks.join(', ') || 'None detected'}
- Styling: ${styling.join(', ') || 'None detected'}
- UI Libraries: ${uiLibs.join(', ') || 'None detected'}
- State Management: ${stateMgmt.join(', ') || 'None detected'}
- Database: ${database ? `${database.type} with ${database.orm}` : 'None detected'}
- Package Manager: ${tech.packageManager || 'Unknown'}

CONFIGURATION FILES:
${Object.entries(configs)
         .map(
            ([name, content]) => `
--- ${name} ---
${content}
`
         )
         .join('\n')}

KEY FILE SNIPPETS:
${Object.entries(analysis.fileInfo || {})
         .filter(([_, info]: [string, any]) => info.snippet)
         .slice(0, 8)
         .map(
            ([path, info]: [string, any]) => `
--- ${path} ---
// Exports: ${info.exports ? info.exports.join(', ') : 'none'}
${info.snippet}
`
         )
         .join('\n')}

FILE STRUCTURE MAP:
${Object.entries(fileMap)
         .map(([category, files]: [string, any]) => {
            if (!files || files.length === 0) return '';
            return `${category.toUpperCase()}: ${files.slice(0, 10).join(', ')}${files.length > 10 ? ` (... +${files.length - 10})` : ''
               }`;
         })
         .filter(Boolean)
         .join('\n')}

SUMMARY:
- ${summary.totalComponents || 0} components
- ${summary.totalHooks || 0} hooks
- ${summary.totalPages || 0} pages/routes
- ${summary.totalModels || 0} models
- ${summary.totalServices || 0} services

====================================
MODE & CONSTRAINTS
====================================
${MODE_RULES}

AUTH & UTILITY USAGE RULE:
- If you use any auth or helper utility (e.g. currentUser, getSession, auth helpers),
  you MUST verify from the provided file snippets or configuration that it works
  in the current execution context (API route, server component, client component).
- If this cannot be verified from the repository context, you MUST present
  multiple safe options (e.g. using the existing helper vs a framework-native
  alternative like getServerSession) instead of assuming behavior.

====================================
TASK
====================================

Action: ${input.action}
User Request: ${input.userInput || 'No additional details provided'}

====================================
REQUIRED OUTPUT FORMAT
====================================

1. CURRENT STATE ANALYSIS
   - Where this functionality exists today
   - Relevant files and logic

2. PROBLEM IDENTIFICATION
   - Exact reason it is broken OR insufficient
   - Evidence from the code

3. PROPOSED CHANGES
   - Minimal fix (for "fix" mode)
   - Structured implementation plan (for "plan"/"implement" mode)

4. FILE IMPACT
   - Modified files
   - New files (only if justified)

5. RATIONALE
   - Why these changes solve the issue
   - Any assumptions made (must be explicit)
`;

   return prompt;
}

export function buildReviewPrompt(input: {
   repoSummary: any;
   diff: string;
   userInput?: string;
}) {
   return `
You are a code reviewer. Review the following pull request and provide constructive feedback.

User Request: ${input.userInput || 'No specific request provided'}

Changes:
\`\`\`diff
${input.diff}
\`\`\`

Provide a detailed review covering:
1. Code quality and best practices
2. Potential bugs or issues
3. Security concerns
4. Performance considerations
5. Suggestions for improvement

Be constructive and specific in your feedback.
`;
}