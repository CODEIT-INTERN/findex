import {
  JobType,
  ResultType,
  type JobType as JobTypeKey,
  type ResultType as ResultTypeKey,
} from "@/types/enums";

export const JobTypeLabels: Record<JobTypeKey, string> = {
  [JobType.INDEX_DATA]: "지수 데이터",
  [JobType.INDEX_INFO]: "지수 정보",
};

export const ResultTypeLabels: Record<ResultTypeKey, string> = {
  [ResultType.SUCCESS]: "성공",
  [ResultType.FAILED]: "실패",
};
