import {client} from "./client.ts";
// @ts-ignore
import {postReqSerialize} from '../test/postReqSerialize.js';
// @ts-ignore
import {postResDeserialize} from '../test/postResDeserialize.js';
import {compactPost, Post, timeFormat} from "./type.ts";
import {getForumName} from "./forum.ts";

export default async function getPost(UserID: string, Page: number) {
  try {
    if (isNaN(Number(UserID))) {
      const res = await client.get(`/tieba/i/sys/user_json?un=${UserID}&ie=utf-8`);
      UserID = res.data.id;
    }

    const buffer = await postReqSerialize(UserID, Page);
    let blob = new Blob([buffer]);
    let data = new FormData();
    data.append('data', blob);

    const response = await client.post('/tieba/c/u/feed/userpost?cmd=303002',
      data,
      {
        headers: {
        'x_bd_data_type': 'protobuf',
        'Content-Type': 'multipart/form-data',
        'Accept': '*/*',
      },
      responseType: 'arraybuffer',
    });

    const responseData = await postResDeserialize(response.data);
    console.log(responseData);
    return await unpack(responseData);
  } catch (error) {
    console.error(error);
    throw error; // 抛出错误，以便外部代码可以捕获并处理
  }
}

const unpack = async (posts:Array<Post>) => {
  let result:Array<compactPost> = [];
  for (let post of posts) {
    const forumName_ = await getForumName(post.forumId);
    console.log(posts);
    for(let content of post.content){
      let affiliated = content.postType == 1
      let isReply = affiliated && content?.postContent[1]?.type == 4;
      result.push({
        forumId: post.forumId,
        forumName: forumName_,
        title: post.title.slice(3),
        threadId: post.threadId,
        postId: post.postId,
        cid: content.postId,
        createTime: timeFormat.format(new Date(post.createTime*1000)),
        affiliated: affiliated,
        content: (isReply) ?
          content.postContent[2].text.slice(2) :
          (content.postContent.length == 1 ?
            content.postContent[0].text : content.postContent.map(item => item.text).join('')
          ),
        replyTo: isReply ? content.postContent[1].text : "",
      });
    }
  }
  return result;
}