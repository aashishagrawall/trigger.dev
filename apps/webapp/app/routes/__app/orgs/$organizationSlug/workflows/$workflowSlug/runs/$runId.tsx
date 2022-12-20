import {
  ClockIcon,
  DocumentTextIcon,
  XCircleIcon,
  ArrowPathRoundedSquareIcon,
  BeakerIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Panel } from "~/components/layout/Panel";
import { PrimaryButton } from "~/components/primitives/Buttons";
import { Spinner } from "~/components/primitives/Spinner";
import { Body } from "~/components/primitives/text/Body";
import {
  Header1,
  Header2,
  Header3,
} from "~/components/primitives/text/Headers";
import CodeBlock from "~/components/code/CodeBlock";
import type { ReactNode } from "react";
import { formatDateTime } from "~/utils";
import githubLogo from "~/assets/images/integrations/logo-github.png";

export default function Page() {
  return (
    <>
      <div className="flex sticky -top-12 py-4 -mt-4 -ml-1 pl-1 bg-slate-850 justify-between items-center z-10">
        <Header1 className="">Run #1</Header1>
        <div className="flex gap-2">
          <Body
            size="extra-small"
            className="flex items-center pl-2 pr-3 py-0.5 rounded uppercase tracking-wide text-slate-500"
          >
            <BeakerIcon className="h-4 w-4 mr-1" />
            Test Run
          </Body>
          <PrimaryButton>
            <ArrowPathRoundedSquareIcon className="h-5 w-5 -ml-1" />
            Rerun
          </PrimaryButton>
        </div>
      </div>

      <ul className="flex gap-6">
        <li className="flex gap-2 items-center">
          <Spinner />
          <Header2 size="small" className="text-slate-400">
            In progress
          </Header2>
        </li>
        <li className="flex gap-1 items-center">
          <Header2 size="small" className="text-slate-400">
            Started: 12:34:56pm Dec 13, 2022
          </Header2>
        </li>
        <li className="flex gap-1 items-center">
          <Header2 size="small" className="text-slate-400">
            Duration: 1m 23s
          </Header2>
        </li>
      </ul>

      <WorkflowStep
        step={{
          type: "trigger",
          status: "complete",
          trigger: {
            on: "webhook",
            input: {
              assignee: "samejr",
              issueId: "uiydfgydfg7yt34",
            },
            integration: "github",
          },
          startedAt: new Date(),
          completedAt: new Date(),
        }}
      />
      <WorkflowStep
        step={{
          type: "trigger",
          status: "error",
          trigger: {
            on: "webhook",
            input: {},
            integration: "github",
          },
          startedAt: new Date(),
          completedAt: new Date(),
          error: {
            message: "Something went wrong",
            statuscode: 500,
          },
        }}
      />
      <WorkflowStep
        step={{
          type: "trigger",
          status: "inProgress",
          trigger: {
            on: "webhook",
            input: {},
            integration: "github",
          },
          startedAt: new Date(),
        }}
      />
      <WorkflowStep
        step={{
          type: "trigger",
          status: "notStarted",
          trigger: {
            on: "webhook",
            input: {},
            integration: "github",
          },
        }}
      />
      <WorkflowStep
        step={{
          type: "trigger",
          status: "inProgress",
          trigger: {
            on: "email",
            address: "james@trigger.dev",
          },
          startedAt: new Date(),
        }}
      />
      <WorkflowStep
        step={{
          type: "log",
          status: "complete",
          message: "Hello world",
          startedAt: new Date(),
          completedAt: new Date(),
        }}
      />
      <WorkflowStep
        step={{
          type: "delay",
          status: "inProgress",
          startedAt: new Date(),
          duration: 60 * 60 * 24 * 18,
        }}
      />
      <WorkflowStep
        step={{
          type: "event",
          status: "inProgress",
          startedAt: new Date(),
          name: "my-event",
          payload: { id: 1, name: "James" },
        }}
      />
      <WorkflowStep
        step={{
          type: "request",
          status: "inProgress",
          startedAt: new Date(),
          integration: "github",
        }}
      />
      <div>
        <Panel>
          <Body>Workflow complete node</Body>
        </Panel>
      </div>
    </>
  );
}

const workflowNodeFlexClasses = "flex gap-1 items-center";
const workflowNodeUppercaseClasses = "uppercase text-slate-400";

function WorkflowStep({ step }: { step: Step }) {
  return (
    <div className="flex items-stretch w-full">
      <div className="relative flex w-5 border-l border-slate-700 ml-2.5">
        <div className="absolute top-6 -left-[18px] p-1 bg-slate-850 rounded-full">
          <Status status={step.status} />
        </div>
      </div>
      <StepPanel status={step.status}>
        <StepHeader step={step} />
        <StepBody step={step} />
        {step.error && <StepError step={step} />}
      </StepPanel>
    </div>
  );
}

function StepBody({ step }: { step: Step }) {
  switch (step.type) {
    case "trigger":
      switch (step.trigger.on) {
        case "webhook":
          return <Webhook webhook={step.trigger} />;
        case "email":
          // return <Email email={step.trigger.on} />;
          break;
        default:
          break;
      }
      break;
    case "log":
      return <Log log={step.message} />;
    case "delay":
      return <Delay step={step} />;
  }
  return <></>;
}

function Webhook({ webhook }: { webhook: WebhookTrigger }) {
  return (
    <>
      <div className="flex justify-between items-baseline">
        <Header3 size="large" className="mb-4">
          GitHub new issue (Webhook)
        </Header3>
        <div className="flex items-baseline gap-2">
          <div className="flex gap-1 items-baseline">
            <Body size="extra-small" className={workflowNodeUppercaseClasses}>
              Repo:
            </Body>
            <Body size="small">jsonhero-web</Body>
          </div>
          <div className="flex gap-1 items-baseline">
            <Body size="extra-small" className={workflowNodeUppercaseClasses}>
              Org:
            </Body>
            <Body size="small">jsonhero-web</Body>
          </div>
        </div>
      </div>
      <CodeBlock code={JSON.stringify(webhook.input)} language="json" />
    </>
  );
}

function Delay({ step }: { step: DelayStep }) {
  return (
    <>
      <Body size="small">{step.duration}</Body>
    </>
  );
}

function Log({ log }: { log: string }) {
  return (
    <Header3 size="large" className="mb-4">
      {log}
    </Header3>
  );
}

function StepError({ step }: { step: Step }) {
  return (
    <>
      <div className="flex gap-2 mb-2 mt-3 ">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
        <Body size="small" className="text-slate-300">
          Failed with error:
        </Body>
      </div>
      <CodeBlock
        code={JSON.stringify(step.error)}
        language="json"
        className="border border-red-600"
      />
    </>
  );
}

function StepHeader({ step }: { step: Step }) {
  return (
    <div className="flex mb-4 pb-3 justify-between items-center border-b border-slate-700">
      <ul className="flex gap-4 items-center">
        <li className={workflowNodeFlexClasses}>
          <StepIcon step={step} />
          <Body size="small">{stepTitle(step)}</Body>
        </li>
        {step.startedAt && (
          <li className={workflowNodeFlexClasses}>
            <Body size="extra-small" className={workflowNodeUppercaseClasses}>
              Started:
            </Body>
            <Body size="small">{formatDateTime(step.startedAt)}</Body>
          </li>
        )}
        {step.completedAt && (
          <li className={workflowNodeFlexClasses}>
            <Body size="extra-small" className={workflowNodeUppercaseClasses}>
              Completed:
            </Body>
            <Body size="small">{formatDateTime(step.completedAt)}</Body>
          </li>
        )}
      </ul>
      {step.type === "trigger" && step.trigger.on === "webhook" ? (
        <div className="flex gap-2 items-center">
          <Body size="small">{step.trigger.integration}</Body>
          <img src={githubLogo} alt="GitHub" className="h-8 shadow" />
        </div>
      ) : null}
    </div>
  );
}

function Status({ status }: { status: WorkflowStepStatus }) {
  switch (status) {
    case "error":
      return <XCircleIcon className="relative h-7 w-7 text-red-500" />;
    case "inProgress":
      return <Spinner className="relative h-6 w-6 ml-[1px] text-blue-500" />;
    case "complete":
      return <CheckCircleIcon className="relative h-7 w-7 text-green-500" />;
    default:
      return <ClockIcon className="relative h-7 w-7 text-slate-500" />;
  }
}

function StepPanel({
  status,
  children,
}: {
  status: WorkflowStepStatus;
  children: ReactNode;
}) {
  let borderClass = "border-slate-800";
  switch (status) {
    case "error":
      borderClass = "border-red-700";
      break;
    case "inProgress":
      borderClass = "border-blue-700";
      break;
  }

  return <Panel className={`border ${borderClass} my-4`}>{children}</Panel>;
}

function stepTitle(step: Step): string {
  switch (step.type) {
    case "log":
      return "Log";
    case "delay":
      return "Delay";
    case "request":
      return "Request";
    case "event":
      return "Event";
    case "trigger":
      switch (step.trigger.on) {
        case "webhook":
          return "Webhook";
        case "scheduled":
          return "Scheduled";
        case "custom":
          return "Custom";
        case "http":
          return "HTTP";
        case "aws":
          return "AWS";
        case "email":
          return "Email";
      }
  }
}

function StepIcon({ step }: { step: Step }) {
  const styleClass = "h-6 w-6 text-slate-400";
  switch (step.type) {
    case "log":
      return <DocumentTextIcon className={styleClass} />;
    case "delay":
      return <CalendarDaysIcon className={styleClass} />;
    case "request":
      return <DocumentTextIcon className={styleClass} />;
    case "event":
      return <DocumentTextIcon className={styleClass} />;
    case "trigger":
      switch (step.trigger.on) {
        case "webhook":
          return <DocumentTextIcon className={styleClass} />;
        case "scheduled":
          return <DocumentTextIcon className={styleClass} />;
        case "custom":
          return <DocumentTextIcon className={styleClass} />;
        case "http":
          return <DocumentTextIcon className={styleClass} />;
        case "aws":
          return <DocumentTextIcon className={styleClass} />;
        case "email":
          return <EnvelopeIcon className={styleClass} />;
      }
  }
}

type Step = LogStep | DelayStep | RequestStep | TriggerStep | EventStep;

type TriggerStep = CommonStepData & {
  type: "trigger";
  trigger:
    | WebhookTrigger
    | ScheduledTrigger
    | CustomTrigger
    | HttpTrigger
    | AwsTrigger
    | EmailTrigger;
};

type LogStep = CommonStepData & {
  type: "log";
  message: string;
};

type DelayStep = CommonStepData & {
  type: "delay";
  duration: number;
};

type RequestStep = CommonStepData & {
  type: "request";
  integration: string;
};

type EventStep = CommonStepData & {
  type: "event";
  name: string;
  payload: any;
};

type WebhookTrigger = {
  on: "webhook";
  integration: string;
  input: any;
};

type ScheduledTrigger = {
  on: "scheduled";
  input: any;
};

type CustomTrigger = {
  on: "custom";
  name: string;
  input: any;
};

type HttpTrigger = {
  on: "http";
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
};

type EmailTrigger = {
  on: "email";
  address: string;
};

type AwsTrigger = {
  on: "aws";
  input: any;
};

type CommonStepData = {
  status: WorkflowStepStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: any;
};

type WorkflowStepStatus = "error" | "inProgress" | "complete" | "notStarted";
