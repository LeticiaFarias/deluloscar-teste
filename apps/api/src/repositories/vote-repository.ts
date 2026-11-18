import {prisma} from "../lib/prisma.js";
export const voteRepository={
 mine:(userId:string)=>prisma.vote.findMany({where:{userId},include:{category:{select:{id:true,name:true,slug:true}},nominee:true}}),
 save:(userId:string,categoryId:string,nomineeId:string)=>prisma.$transaction(async tx=>{
 const state=await tx.$queryRaw<Array<{status:string}>>`SELECT status FROM voting_state WHERE id=true FOR SHARE`;
 if(!state[0]||state[0].status!=="open")return {closed:true as const};
 const nominee=await tx.nominee.findFirst({where:{id:nomineeId,categoryId},select:{id:true}});
 if(!nominee)return {invalid:true as const};
 const vote=await tx.vote.upsert({where:{userId_categoryId:{userId,categoryId}},update:{nomineeId},create:{userId,categoryId,nomineeId}});
 return {closed:false as const,vote};
 }),
 aggregate:()=>prisma.category.findMany({orderBy:{displayOrder:"asc"},include:{nominees:{orderBy:{name:"asc"},include:{_count:{select:{votes:true}}}}}})
};