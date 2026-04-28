import * as cdk from 'aws-cdk-lib';
import { WorkflowStack } from '../lib/app-stack';

const app = new cdk.App();
new WorkflowStack(app, 'WorkflowStack');
