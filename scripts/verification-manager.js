#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');
const ScreenCaptureVerifier = require('./screen-capture-verifier.js');

class VerificationManager {
    constructor() {
        this.projectRoot = process.cwd();
        this.verificationDir = path.join(this.projectRoot, 'mobile-native-fresh', 'verification');
        this.logsDir = path.join(this.projectRoot, 'logs');
        this.summariesDir = path.join(this.projectRoot, 'mobile-native-fresh', 'tasks', 'summaries');
        
        this.screenVerifier = new ScreenCaptureVerifier();
        
        // Ensure directories exist
        this.ensureDirectories();
        
        // Configuration
        this.config = {
            verificationTimeout: 60000, // 1 minute
            autoApproveThreshold: 0.8, // 80% confidence for auto-approval
            maxRetries: 3,
            verificationTypes: ['ui', 'functionality', 'performance', 'accessibility']
        };
    }

    ensureDirectories() {
        const dirs = [this.verificationDir, this.logsDir, this.summariesDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level}: ${message}\n`;
        const logFile = path.join(this.logsDir, 'verification-manager.log');
        
        fs.appendFileSync(logFile, logEntry);
        console.log(`[${timestamp}] ${level}: ${message}`);
    }

    async createVerificationTask(taskData) {
        const timestamp = new Date().toISOString();
        const taskId = `verification-${timestamp.replace(/[:.]/g, '-')}`;
        
        const verificationTask = {
            id: taskId,
            timestamp: timestamp,
            type: 'ghost-runner-verification',
            task: taskData,
            status: 'pending',
            verificationSteps: [
                {
                    name: 'screen-capture',
                    status: 'pending',
                    required: true,
                    description: 'Capture app load, content load, and dashboard screens'
                },
                {
                    name: 'human-review',
                    status: 'pending',
                    required: true,
                    description: 'Human review of captured screenshots'
                },
                {
                    name: 'gpt-analysis',
                    status: 'pending',
                    required: true,
                    description: 'GPT analysis of UI integrity and functionality'
                }
            ],
            results: {},
            metadata: {
                createdBy: 'ghost-runner',
                priority: 'high',
                requiresApproval: true
            }
        };
        
        const taskPath = path.join(this.verificationDir, `${taskId}.json`);
        fs.writeFileSync(taskPath, JSON.stringify(verificationTask, null, 2));
        
        await this.log(`Verification task created: ${taskId}`);
        return verificationTask;
    }

    async executeVerificationWorkflow(taskId) {
        try {
            await this.log(`Starting verification workflow for task: ${taskId}`);
            
            const taskPath = path.join(this.verificationDir, `${taskId}.json`);
            if (!fs.existsSync(taskPath)) {
                throw new Error(`Task not found: ${taskId}`);
            }
            
            const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
            
            // Step 1: Screen Capture
            await this.log('Step 1: Executing screen capture verification...');
            const captureResults = await this.screenVerifier.captureAllScreens();
            
            task.results.screenCapture = captureResults;
            task.verificationSteps[0].status = captureResults.summary.failed === 0 ? 'completed' : 'failed';
            task.verificationSteps[0].result = captureResults;
            
            // Step 2: Human Review Request
            await this.log('Step 2: Generating human review request...');
            const humanReviewRequest = await this.generateHumanReviewRequest(task, captureResults);
            
            task.results.humanReviewRequest = humanReviewRequest;
            task.verificationSteps[1].status = 'pending';
            task.verificationSteps[1].requestId = humanReviewRequest.id;
            
            // Step 3: GPT Analysis Request
            await this.log('Step 3: Generating GPT analysis request...');
            const gptAnalysisRequest = await this.generateGPTAnalysisRequest(task, captureResults);
            
            task.results.gptAnalysisRequest = gptAnalysisRequest;
            task.verificationSteps[2].status = 'pending';
            task.verificationSteps[2].requestId = gptAnalysisRequest.id;
            
            // Update task status
            task.status = 'verification-pending';
            fs.writeFileSync(taskPath, JSON.stringify(task, null, 2));
            
            await this.log(`Verification workflow completed for task: ${taskId}`);
            return task;
            
        } catch (error) {
            await this.log(`Verification workflow failed: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    async generateHumanReviewRequest(task, captureResults) {
        const timestamp = new Date().toISOString();
        const requestId = `human-review-${timestamp.replace(/[:.]/g, '-')}`;
        
        const humanReviewRequest = {
            id: requestId,
            timestamp: timestamp,
            type: 'human-review',
            taskId: task.id,
            captures: captureResults.captures,
            instructions: [
                'Review the captured screenshots for visual integrity and functionality',
                'Check for proper app loading, content display, and dashboard functionality',
                'Verify no blank screens, broken layouts, or visual regressions',
                'Confirm all UI elements are visible and properly positioned',
                'Test navigation and interactive elements if possible',
                'Note any issues or concerns in the review comments'
            ],
            criteria: {
                appLoad: 'App should load without errors and display initial screen',
                contentLoad: 'Content should load properly with no missing elements',
                dashboard: 'Dashboard should display all components correctly',
                navigation: 'Navigation elements should be functional',
                visualConsistency: 'UI should be consistent with design system'
            },
            status: 'pending',
            requiresApproval: true,
            approvalDeadline: new Date(Date.now() + this.config.verificationTimeout).toISOString()
        };
        
        const requestPath = path.join(this.verificationDir, `${requestId}.json`);
        fs.writeFileSync(requestPath, JSON.stringify(humanReviewRequest, null, 2));
        
        await this.log(`Human review request generated: ${requestId}`);
        return humanReviewRequest;
    }

    async generateGPTAnalysisRequest(task, captureResults) {
        const timestamp = new Date().toISOString();
        const requestId = `gpt-analysis-${timestamp.replace(/[:.]/g, '-')}`;
        
        const gptAnalysisRequest = {
            id: requestId,
            timestamp: timestamp,
            type: 'gpt-analysis',
            taskId: task.id,
            captures: captureResults.captures,
            analysisInstructions: [
                'Analyze the captured screenshots for visual consistency and UI integrity',
                'Check for proper component rendering and layout structure',
                'Verify navigation elements and interactive components',
                'Identify any visual regressions or broken UI elements',
                'Assess accessibility compliance and user experience',
                'Provide confidence score and detailed analysis report'
            ],
            analysisCriteria: {
                visualConsistency: 'UI elements should follow consistent design patterns',
                componentRendering: 'All components should render correctly',
                layoutStructure: 'Layout should be properly structured and responsive',
                navigationElements: 'Navigation should be functional and accessible',
                accessibilityCompliance: 'UI should meet accessibility standards',
                userExperience: 'Overall user experience should be smooth and intuitive'
            },
            status: 'pending',
            requiresAnalysis: true,
            analysisDeadline: new Date(Date.now() + this.config.verificationTimeout).toISOString()
        };
        
        const requestPath = path.join(this.verificationDir, `${requestId}.json`);
        fs.writeFileSync(requestPath, JSON.stringify(gptAnalysisRequest, null, 2));
        
        await this.log(`GPT analysis request generated: ${requestId}`);
        return gptAnalysisRequest;
    }

    async waitForVerificationApproval(taskId, timeout = this.config.verificationTimeout) {
        await this.log(`Waiting for verification approval: ${taskId}`);
        
        const startTime = Date.now();
        const taskPath = path.join(this.verificationDir, `${taskId}.json`);
        
        while (Date.now() - startTime < timeout) {
            if (fs.existsSync(taskPath)) {
                const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
                
                // Check if all verification ste{ { { { ps are completed & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
                const allCompleted = task.verificationSteps.every(step => 
                    step.status === 'completed' || step.status === 'approved'
                );
                
                const anyFailed = task.verificationSteps.some(step => 
                    step.status === 'failed' || step.status === 'rejected'
                );
                
                if (allCompleted && !anyFailed) {
                    await this.log(`✅ All verification ste{ { { { ps completed: ${taskId & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}`);
                    return { approved: true, task };
                } else if (anyFailed) {
                    await this.log(`❌ Some verification ste{ { { { ps failed: ${taskId & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}`, 'ERROR');
                    return { approved: false, task };
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        await this.log(`⏰ Verification timeout: ${taskId}`, 'WARN');
        return { approved: false, timeout: true };
    }

    async processVerificationResponse(taskId, response) {
        try {
            await this.log(`Processing verification response for task: ${taskId}`);
            
            const taskPath = path.join(this.verificationDir, `${taskId}.json`);
            if (!fs.existsSync(taskPath)) {
                throw new Error(`Task not found: ${taskId}`);
            }
            
            const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
            
            // Update task with response
            task.results.verificationResponse = response;
            task.status = response.approved ? 'approved' : 'rejected';
            task.completedAt = new Date().toISOString();
            
            // Update verification ste{ { { { ps based on response & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
            if (response.humanReview) {
                const humanStep = task.verificationSteps.find(step => step.name === 'human-review');
                if (humanStep) {
                    humanStep.status = response.humanReview.approved ? 'approved' : 'rejected';
                    humanStep.result = response.humanReview;
                }
            }
            
            if (response.gptAnalysis) {
                const gptStep = task.verificationSteps.find(step => step.name === 'gpt-analysis');
                if (gptStep) {
                    gptStep.status = response.gptAnalysis.approved ? 'approved' : 'rejected';
                    gptStep.result = response.gptAnalysis;
                }
            }
            
            // Save updated task
            fs.writeFileSync(taskPath, JSON.stringify(task, null, 2));
            
            // Generate summary
            const summary = await this.generateVerificationSummary(task);
            
            await this.log(`Verification response processed for task: ${taskId}`);
            return { task, summary };
            
        } catch (error) {
            await this.log(`Failed to process verification response: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    async generateVerificationSummary(task) {
        const timestamp = new Date().toISOString();
        const summaryId = `verification-summary-${timestamp.replace(/[:.]/g, '-')}`;
        
        const summary = {
            id: summaryId,
            taskId: task.id,
            timestamp: timestamp,
            status: task.status,
            verificationSteps: task.verificationSteps.map(step => ({
                name: step.name,
                status: step.status,
                required: step.required,
                description: step.description
            })),
            results: {
                screenCapture: task.results.screenCapture?.summary || {},
                humanReview: task.results.verificationResponse?.humanReview || {},
                gptAnalysis: task.results.verificationResponse?.gptAnalysis || {}
            },
            overallResult: task.status === 'approved' ? 'PASSED' : 'FAILED',
            metadata: {
                totalSteps: task.verificationSteps.length,
                completedSteps: task.verificationSteps.filter(s => s.status === 'completed' || s.status === 'approved').length,
                failedSteps: task.verificationSteps.filter(s => s.status === 'failed' || s.status === 'rejected').length
            }
        };
        
        // Save summary
        const summaryPath = path.join(this.summariesDir, `${summaryId}.md`);
        const summaryContent = this.formatSummaryAsMarkdown(summary);
        fs.writeFileSync(summaryPath, summaryContent);
        
        await this.log(`Verification summary generated: ${summaryId}`);
        return summary;
    }

    formatSummaryAsMarkdown(summary) {
        return `# Verification Summary

**Generated**: ${summary.timestamp}  
**Task ID**: ${summary.taskId}  
**Status**: ${summary.status}  
**Overall Result**: ${summary.overallResult}

## Verification Ste{ { { { ps

${summary.verificationSteps.map(step => { & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    const status = step.status === 'completed' || step.status === 'approved' ? '✅' : 
                   step.status === 'failed' || step.status === 'rejected' ? '❌' : '⏳';
    return `- ${status} **${step.name}**: ${step.description} (${step.status})`;
}).join('\n')}

## Results Summary

### Screen Capture
- **Status**: ${summary.results.screenCapture.success || 0}/${summary.results.screenCapture.total || 0} successful
- **Failed Captures**: ${summary.results.screenCapture.failed || 0}

### Human Review
- **Status**: ${summary.results.humanReview.approved ? '✅ Approved' : '❌ Rejected'}
- **Comments**: ${summary.results.humanReview.comments || 'No comments provided'}

### GPT Analysis
- **Status**: ${summary.results.gptAnalysis.approved ? '✅ Approved' : '❌ Rejected'}
- **Confidence**: ${summary.results.gptAnalysis.confidence || 'N/A'}
- **Analysis**: ${summary.results.gptAnalysis.analysis || 'No analysis provided'}

## Metadata

- **Total Steps**: ${summary.metadata.totalSteps}
- **Completed Steps**: ${summary.metadata.completedSteps}
- **Failed Steps**: ${summary.metadata.failedSteps}

## Next Ste{ { { { ps

${summary.overallResult === 'PASSED' ? & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    '✅ Verification completed successfully. Task can proceed.' : 
    '❌ Verification failed. Task requires review and fixes before proceeding.'
}
`;
    }

    async runGhostRunnerVerification(taskData) {
        try {
            await this.log('Starting Ghost Runner verification workflow...');
            
            // Step 1: Create verification task
            const verificationTask = await this.createVerificationTask(taskData);
            
            // Step 2: Execute verification workflow
            const updatedTask = await this.executeVerificationWorkflow(verificationTask.id);
            
            // Step 3: Wait for approval
            const approvalResult = await this.waitForVerificationApproval(verificationTask.id);
            
            // Step 4: Process response
            const finalResult = await this.processVerificationResponse(verificationTask.id, {
                approved: approvalResult.approved,
                humanReview: approvalResult.task?.results?.humanReviewRequest,
                gptAnalysis: approvalResult.task?.results?.gptAnalysisRequest
            });
            
            await this.log(`Ghost Runner verification completed: ${approvalResult.approved ? 'APPROVED' : 'REJECTED'}`);
            
            return {
                success: approvalResult.approved,
                task: finalResult.task,
                summary: finalResult.summary,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            await this.log(`Ghost Runner verification failed: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }
}

// CLI usage
if (require.main === module) {
    const manager = new VerificationManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'create-task':
            const taskData = JSON.parse(process.argv[3] || '{}');
            manager.createVerificationTask(taskData).then(task => {
                console.log(JSON.stringify(task, null, 2));
            });
            break;
        case 'execute-workflow':
            const taskId = process.argv[3];
            manager.executeVerificationWorkflow(taskId).then(task => {
                console.log(JSON.stringify(task, null, 2));
            });
            break;
        case 'wait-approval':
            const waitTaskId = process.argv[3];
            manager.waitForVerificationApproval(waitTaskId).then(result => {
                console.log(JSON.stringify(result, null, 2));
            });
            break;
        case 'process-response':
            const responseTaskId = process.argv[3];
            const response = JSON.parse(process.argv[4] || '{}');
            manager.processVerificationResponse(responseTaskId, response).then(result => {
                console.log(JSON.stringify(result, null, 2));
            });
            break;
        case 'verify':
            const verifyTaskData = JSON.parse(process.argv[3] || '{}');
            manager.runGhostRunnerVerification(verifyTaskData).then(result => {
                console.log(JSON.stringify(result, null, 2));
            });
            break;
        default:
            console.log('Usage: { { { { node verification-manager.js [create-task|execute-workflow|wait-approval|process-response|verify] [taskData]') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
    }
}

module.exports = VerificationManager; 