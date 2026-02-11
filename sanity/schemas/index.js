import teamMember from "./teamMember";
import user from "./user";
import form, { formField } from "./form";
import response, { responseAnswer } from "./response";
import message from "./message";
import conversation from "./conversation";
import teamMemberInvite from "./teamMemberInvite";
import jobPosition from "./jobPosition";
import application from "./application";

export const schemaTypes = [
  teamMember,
  user,
  form,
  formField,
  response,
  responseAnswer,
  message,
  conversation,
  teamMemberInvite,
  jobPosition,
  application,
];

export const schema = {
  types: schemaTypes,
};
