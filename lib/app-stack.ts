import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class WorkflowStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const configParam = new ssm.StringParameter(this, 'AppGreeting', {
      parameterName: '/app/config/greeting',
      stringValue: 'Hello from CI/CD Automated Infrastructure!',
    });

    const myLambda = new lambda.Function(this, 'WorkflowTask', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
    });

    configParam.grantRead(myLambda);

    const startPass = new stepfunctions.Pass(this, 'StartPass');

    const submitTask = new tasks.LambdaInvoke(this, 'Invoke Task', {
      lambdaFunction: myLambda,
    });

    submitTask.addRetry({ maxAttempts: 2 });

    new stepfunctions.StateMachine(this, 'MyStateMachine', {
      definition: startPass.next(submitTask),
    });
  }
}