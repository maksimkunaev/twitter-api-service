require("dotenv").config();

const axios = require("axios").default;
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

async function getUserByUserName(usernames) {
  const url = `https://api.twitter.com/2/users/by`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        usernames,
        "user.fields": "created_at",
        expansions: "pinned_tweet_id",
        "tweet.fields": "author_id,created_at",
      },
    });

    return response?.data?.data.length && response.data.data[0];
  } catch (err) {
    console.log(err);
  }
}

async function getTweetsByUserId(userId, params = {}) {
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        "tweet.fields": "created_at",
        expansions: "attachments.media_keys",
        "tweet.fields":
          "created_at,author_id,lang,public_metrics,context_annotations,entities",
        max_results: "5",
        ...params,
      },
    });

    return response?.data?.data.length && response.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function getTweetsByConversationId(conversationId, params = {}) {
  const url = `https://api.twitter.com/2/tweets/search/recent`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        query: `conversation_id:${conversationId}`,
        "tweet.fields":
          "in_reply_to_user_id,author_id,created_at,conversation_id",
        ...params,
      },
    });
    console.log(response?.data);
    return response?.data;
  } catch (err) {
    console.log(err);
  }
}

async function searchTweetsByQuery(queryString, params = {}) {
  const url = `https://api.twitter.com/2/tweets/search/recent`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      params: {
        query: "from:TwitterDev",
        "tweet.fields": "created_at",
        expansions: "author_id",
        "user.fields": "created_at",
        ...params,
      },
    });
    console.log(response?.data);
    return response?.data;
  } catch (err) {
    console.log(err);
  }
}

async function getTweetsByAuthor(authorName) {
  const user = await getUserByUserName(authorName);
  const tweets = await getTweetsByUserId(user.id, { max_results: "30" });

  return tweets;
}
module.exports = {
  getTweetsByAuthor,
  getTweetsByConversationId,
  searchTweetsByQuery,
};

(async () => {
  const tweets = await getTweetsByAuthor("elonmusk");

  console.log(tweets);
})();
