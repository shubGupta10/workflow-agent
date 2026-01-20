export function buildPlanningPrompt(input: {
   repoSummary: any;
   action: string;
   userInput?: string;
}) {
   // Extract full repository understanding
   const tech = input.repoSummary.technologies || {};
   const fileMap = input.repoSummary.fileMap || {};
   const summary = input.repoSummary.summary || {};

   const frameworks = tech.frameworks || [];
   const database = tech.database;
   const languages = tech.languages || [];

   // Build comprehensive repository context
   const prompt = `
You are tasked with creating a detailed implementation plan for a code repository.

====================================
REPOSITORY UNDERSTANDING
====================================

TECHNOLOGIES:
- Languages: ${languages.join(', ') || 'Unknown'}
- Frameworks: ${frameworks.map((f: any) => `${f.name} (${f.type})`).join(', ') || 'None detected'}
- Database: ${database ? `${database.type} with ${database.orm}` : 'None detected'}
- Package Manager: ${tech.packageManager || 'Unknown'}

FILE STRUCTURE MAP:
${Object.entries(fileMap).map(([category, files]: [string, any]) => {
      if (!files || files.length === 0) return '';
      return `
${category.toUpperCase()} (${files.length} files):
${files.slice(0, 5).map((f: string) => `  - ${f}`).join('\n')}${files.length > 5 ? `\n  ... and ${files.length - 5} more` : ''}`;
   }).filter(Boolean).join('\n')}

SUMMARY:
- ${summary.totalModels || 0} models
- ${summary.totalServices || 0} services  
- ${summary.totalControllers || 0} controllers
- ${summary.totalRoutes || 0} routes
- ${summary.totalComponents || 0} components
- ${summary.totalTests || 0} tests

====================================
CRITICAL RULES
====================================

1. USE ONLY DETECTED TECHNOLOGIES
   - ONLY use the languages, frameworks, and database listed above
   - DO NOT suggest Prisma if Mongoose is detected
   - DO NOT suggest Mongoose if Prisma is detected
   - DO NOT suggest Next.js API routes if Express is the backend
   - DO NOT invent technologies not listed

2. FOLLOW EXISTING FILE PATTERNS
   - Look at the FILE STRUCTURE MAP above
   - Place new files in the same locations as existing similar files
   - If models are in "src/modules/*/\*.model.ts", put new models there
   - If services are in "src/services/", put new services there
   - MATCH the existing naming conventions exactly

3. IF INFORMATION IS MISSING
   - If no models/services/controllers are detected, ASK the user where to create them
   - If no database is detected, ASK what database they're using
   - If no framework is detected, ASK what framework they're using
   - DO NOT make assumptions or hallucinate

4. PROVIDE COMPLETE, WORKING CODE
   - Include all necessary imports
   - Follow the detected language (TypeScript vs JavaScript)
   - Use the detected ORM/database correctly
   - Include error handling
   - Match existing code style

====================================
TASK
====================================

Action: ${input.action}
${input.userInput ? `User Request: ${input.userInput}` : ''}

Create a detailed implementation plan that:
1. Identifies which existing files need to be modified
2. Specifies which new files need to be created (with exact paths matching existing patterns)
3. Provides complete code for each change
4. Explains the reasoning for each step

Use ONLY the technologies and patterns detected in the repository above.
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