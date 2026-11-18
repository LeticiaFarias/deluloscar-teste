import {z} from "zod";
export const registerSchema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email(),password:z.string().min(8).max(72)});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1).max(72)});
export const voteSchema=z.object({nomineeId:z.string().uuid()});
export const votingStateSchema=z.object({status:z.enum(["open","closed"]),resultsPublished:z.boolean()});
export type Role="user"|"admin"; export type VotingStatus="open"|"closed";
export interface AuthUser{id:string;name:string;email:string;role:Role}
export interface AuthResponse{token:string;user:AuthUser}
export interface Nominee{id:string;name:string;description:string;imageUrl:string|null;voteCount?:number;percentage?:number}
export interface Category{id:string;name:string;slug:string;description:string;nominees?:Nominee[]}
export interface VotingState{status:VotingStatus;resultsPublished:boolean}
export interface CategoryResult{categoryId:string;categoryName:string;nominees:Nominee[];winner:Nominee[];totalVotes:number}
