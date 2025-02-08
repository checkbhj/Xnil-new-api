const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("querystring");
const { URLSearchParams } = require('url');


async function shortenURL(url) {
	try {
		const result = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
		return result.data; // সংক্ষিপ্ত লিংক ফেরত দেয়
	} catch (err) {
		let errorMessage;
		if (err.response) {
			errorMessage = `API Error: ${JSON.stringify(err.response.data)}`;
		} else {
			errorMessage = `Request Failed: ${err.message}`;
		}
		return errorMessage; // ত্রুটির বার্তা ফেরত দেওয়া হচ্ছে
	}
}

//igdl

 const getDownloadLinks = url => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) {
        return reject({
          msg: "Invalid URL"
        });
      }

      function decodeData(data) {
        let [part1, part2, part3, part4, part5, part6] = data;

        function decodeSegment(segment, base, length) {
          const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
          let baseSet = charSet.slice(0, base);
          let decodeSet = charSet.slice(0, length);

          let decodedValue = segment.split("").reverse().reduce((accum, char, index) => {
            if (baseSet.indexOf(char) !== -1) {
              return accum += baseSet.indexOf(char) * Math.pow(base, index);
            }
          }, 0);

          let result = "";
          while (decodedValue > 0) {
            result = decodeSet[decodedValue % length] + result;
            decodedValue = Math.floor(decodedValue / length);
          }

          return result || "0";
        }

        part6 = "";
        for (let i = 0, len = part1.length; i < len; i++) {
          let segment = "";
          while (part1[i] !== part3[part5]) {
            segment += part1[i];
            i++;
          }

          for (let j = 0; j < part3.length; j++) {
            segment = segment.replace(new RegExp(part3[j], "g"), j.toString());
          }
          part6 += String.fromCharCode(decodeSegment(segment, part5, 10) - part4);
        }
        return decodeURIComponent(encodeURIComponent(part6));
      }

      function extractParams(data) {
        return data.split("decodeURIComponent(escape(r))}(")[1].split("))")[0].split(",").map(item => item.replace(/"/g, "").trim());
      }

      function extractDownloadUrl(data) {
        return data.split("getElementById(\"download-section\").innerHTML = \"")[1].split("\"; document.getElementById(\"inputData\").remove(); ")[0].replace(/\\(\\)?/g, "");
      }

      function getVideoUrl(data) {
        return extractDownloadUrl(decodeData(extractParams(data)));
      }

      const response = await axios.post("https://snapsave.app/action.php?lang=id", "url=" + url, {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          origin: "https://snapsave.app",
          referer: "https://snapsave.app/id",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        }
      });

      const data = response.data;
      const videoPageContent = getVideoUrl(data);
      const $ = cheerio.load(videoPageContent);
      const downloadLinks = [];

        $("div.download-items__thumb").each((index, item) => {
          $("div.download-items__btn").each((btnIndex, button) => {
            let downloadUrl = $(button).find("a").attr("href");
            if (!/https?:\/\//.test(downloadUrl || "")) {
              downloadUrl = "https://snapsave.app" + downloadUrl;
            }
            downloadLinks.push(downloadUrl);
          });
        });
      if (!downloadLinks.length) {
        return reject({
          msg: "No data found"
        });
      }

      return resolve({
          url: downloadLinks,
          metadata: {
              url: url
          }
      });
    } catch (error) {
      return reject({
        msg: error.message
      });
    }
  });
};

const HEADERS = {
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Content-Type": "application/x-www-form-urlencoded",
  "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
  "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
  "X-IG-App-ID": "1217981644879628",
  "X-FB-LSD": "AVqbxe3J_YA",
  "X-ASBD-ID": "129477",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
};

function getInstagramPostId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|tv|stories|reel)\/([^/?#&]+).*/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function encodeGraphqlRequestData(shortcode) {
  const requestData = {
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "3",
    __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
    dpr: "3",
    __ccg: "UNKNOWN",
    __rev: "1008824440",
    __s: "xf44ne:zhh75g:xr51e7",
    __hsi: "7282217488877343271",
    __dyn:
      "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
    __csr:
      "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
    __comet_req: "7",
    lsd: "AVqbxe3J_YA",
    jazoest: "2957",
    __spin_r: "1008824440",
    __spin_b: "trunk",
    __spin_t: "1695523385",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_comment_count: null,
      fetch_related_profile_media_count: null,
      parent_comment_count: null,
      child_comment_count: null,
      fetch_like_count: null,
      fetch_tagged_user_count: null,
      fetch_preview_comment_count: null,
      has_threaded_comments: false,
      hoisted_comment_id: null,
      hoisted_reply_id: null,
    }),
    server_timestamps: "true",
    doc_id: "10015901848480474",
  };

  return qs.stringify(requestData);
}

async function getPostGraphqlData(postId, proxy) {
  try {
    const encodedData = encodeGraphqlRequestData(postId);
    const response = await axios.post(
      "https://www.instagram.com/api/graphql",
      encodedData,
      { headers: HEADERS, httpsAgent: proxy },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

function extractPostInfo(mediaData) {
  try {
    const getUrlFromData = (data) => {
      if (data.edge_sidecar_to_children) {
        return data.edge_sidecar_to_children.edges.map(
          (edge) => edge.node.video_url || edge.node.display_url,
        );
      }
      return data.video_url ? [data.video_url] : [data.display_url];
    };
    const view = mediaData.video_play_count;

    return {
      author: "xnil",
      status: 200,
      url: getUrlFromData(mediaData)[0],
         caption: mediaData.edge_media_to_caption.edges[0]?.node.text || null,
         username: mediaData.owner.username,
         videoviews: view,
         like: mediaData.edge_media_preview_like.count,
         comment: mediaData.edge_media_to_comment.count,
         isVideo: mediaData.is_video,

    };
  } catch (error) {
    throw error;
  }
}


async function igdown(url, proxy = null) {
    const postId = getInstagramPostId(url);
    if (!postId) {
      throw new Error("Invalid Instagram URL");
    }
    const data = await getPostGraphqlData(postId, proxy);
    const mediaData = data.data?.xdt_shortcode_media;
    return extractPostInfo(mediaData);
}

//tikdl

async function ttsave(videoUrl) { const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`;

try { const response = await axios.get(apiUrl); const data = response.data;

if (data.code === 0) {
  const videoData = data.data;
  
  return {
    id: videoData.author.id,
    region: videoData.region,
    Unique_id: videoData.author.unique_id,
    NickName: videoData.author.nickname,
    title: videoData.title,
    duration: videoData.duration,
    cover: videoData.cover,
    url: videoData.play,
    waterMark: videoData.wmplay,
  };
} else {
  console.error('Error fetching video:', data.msg);
  return null;
}

} catch (error) { console.error('Error:', error); return null; } }


//Pinterestdl

async function savepin(url) {
  try {
    const response = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`);
    const html = response.data;
    const $ = cheerio.load(html);

    let results = [];
    $('td.video-quality').each((index, element) => {
      const type = $(element).text().trim();
      const format = $(element).next().text().trim();
      const downloadLinkElement = $(element).nextAll().find('#submiturl').attr('href');

      if (downloadLinkElement) {
        let downloadLink = downloadLinkElement;
        if (downloadLink.startsWith('force-save.php?url=')) {
          downloadLink = decodeURIComponent(downloadLink.replace('force-save.php?url=', ''));
        }
        results.push({ type, format, downloadLink });
      }
    });

    const title = $('h1').text().trim();

    return {
      author: "xnil",
      status: 200,
      data: {
        title,
        data: results[0],
        data2: results[1]
      }
    };
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return { success: false, message: error.message };
  }
}


//likeedl
async function likeedown(videoUrl) {
  try {
    const response = await axios.post(
      'https://snapsave.cc/wp-json/aio-dl/video-data/',
      new URLSearchParams({
        'url': videoUrl,
        'token': '2aa2a0f4924b44603234b01e4fd0ff614e778b0c2f2d000f29b6c42542e4a34c',
        'hash': 'aHR0cHM6Ly9sLmxpa2VlLnZpZGVvL3YvbUdVRnNL1030YWlvLWRs'
      }),
      {
        headers: {
          'authority': 'snapsave.cc',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cookie': 'PHPSESSID=613u24ps3qio00c9g15luf5adm; pll_language=en; dom3ic8zudi28v8lr6fgphwffqoz0j6c=d3500850-5e88-44af-bc61-03c7b643366f%3A2%3A1; sb_main_25487d0c7ea9897588de5e9383d5b500=1; sb_count_25487d0c7ea9897588de5e9383d5b500=1',
          'origin': 'https://snapsave.cc',
          'referer': 'https://snapsave.cc/likee-video-downloader/',
          'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    const data = response.data;

    return {
      author: "xnil",
      status: 200,
      url: data.url,
      title: data.title,
      thumbnail: data.thumbnail,
      source: data.source,
      video: data.medias.length > 0 ? data.medias[0].url : null,
      quality: data.medias.length > 0 ? data.medias[0].quality : null,
      size: data.medias.length > 0 ? data.medias[0].formattedSize : null
    };
  } catch (error) {
    console.error('Error downloading Likee video:', error.message);
    return {
      author: "xnil",
      status: 500,
      error: error.message
    };
  }
}

//deepseek ai
async function deepseek(text) {
    const url = 'https://api.blackbox.ai/api/chat';
    const data = {
        messages: [
            {
                content: text,
                role: "user"
            }
        ],
        model: "deepseek-ai/DeepSeek-V3",
        max_tokens: "1024"
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const formattedResponse = {
            author: "xnil",
            status: response.status,
            msg: response.data
        };

        return formattedResponse;
    } catch (error) {
        const errorResponse = {
            author: "Herza",
            status: error.response ? error.response.status : 500,
            msg: error.response ? error.response.data : error.message
        };

        return errorResponse;
    }
}

//ytstalk

async function ytStalk(username) {
    try {
        const { data } = await axios.get(`https://youtube.com/@${username}?si=ECterZh_kG0zdihm`);
        const $ = cheerio.load(data);

        const ytInitialDataScript = $('script').filter((i, el) => {
            return $(el).html().includes('var ytInitialData =');
        }).html();

        const jsonData = ytInitialDataScript.match(/var ytInitialData = (.*?);/);
        if (jsonData && jsonData[1]) {
            const parsedData = JSON.parse(jsonData[1]);

            const channelMetadata = {
                username: null,
                subscriberCount: null,
                videoCount: null,
                avatarUrl: null,
                channelUrl: null,
                externalId: null,
                description: null,
                rssUrl: null,
                isFamilySafe: null
            };

            if (parsedData.header && parsedData.header.pageHeaderRenderer) {
                const header = parsedData.header.pageHeaderRenderer;
                channelMetadata.username = header.content.pageHeaderViewModel.metadata.contentMetadataViewModel.metadataRows[0].metadataParts[0].text.content;

                if (header.content.pageHeaderViewModel.image.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources.length > 0) {
                    channelMetadata.avatarUrl = header.content.pageHeaderViewModel.image.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources[0].url;
                }
            }

            if (parsedData.metadata && parsedData.metadata.channelMetadataRenderer) {
                const channelMeta = parsedData.metadata.channelMetadataRenderer;
                channelMetadata.description = channelMeta.description;
                channelMetadata.externalId = channelMeta.externalId;
                channelMetadata.rssUrl = channelMeta.rssUrl;
                channelMetadata.channelUrl = channelMeta.channelUrl;
                channelMetadata.isFamilySafe = channelMeta.isFamilySafe;

                const metadataRows = parsedData.header.pageHeaderRenderer.content.pageHeaderViewModel.metadata.contentMetadataViewModel.metadataRows;
                if (metadataRows.length > 1) {
                    const subscriberRow = metadataRows[1];
                    subscriberRow.metadataParts.forEach(part => {
                        if (part.text && part.text.content) {
                            if (part.text.content.includes("subscribers")) {
                                channelMetadata.subscriberCount = part.text.content;
                            } else if (part.text.content.includes("videos")) {
                                channelMetadata.videoCount = part.text.content;
                            }
                        }
                    });
                }
            }

            const videoDataList = [];
            const tabs = parsedData.contents.twoColumnBrowseResultsRenderer.tabs;
            if (tabs && tabs.length > 0) {
                const videosTab = tabs[0].tabRenderer.content.sectionListRenderer.contents;
                videosTab.forEach(item => {
                    if (item.itemSectionRenderer) {
                        item.itemSectionRenderer.contents.forEach(content => {
                            if (content.shelfRenderer && content.shelfRenderer.content && content.shelfRenderer.content.horizontalListRenderer) {
                                const items = content.shelfRenderer.content.horizontalListRenderer.items;
                                items.forEach(video => {
                                    if (video.gridVideoRenderer) {
                                        const videoData = {
                                            videoId: video.gridVideoRenderer.videoId,
                                            title: video.gridVideoRenderer.title.simpleText,
                                            thumbnail: video.gridVideoRenderer.thumbnail.thumbnails[0].url,
                                            publishedTime: video.gridVideoRenderer.publishedTimeText.simpleText,
                                            viewCount: video.gridVideoRenderer.viewCountText.simpleText,
                                            navigationUrl: null,
                                            commonConfigUrl: null,
                                            duration: null
                                        };

                                        if (video.gridVideoRenderer.navigationEndpoint.commandMetadata) {
                                            videoData.navigationUrl = video.gridVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                                        }

                                        if (video.gridVideoRenderer.navigationEndpoint.watchEndpoint && video.gridVideoRenderer.navigationEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig) {
                                            videoData.commonConfigUrl = video.gridVideoRenderer.navigationEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig.html5PlaybackOnesieConfig.commonConfig.url;
                                        }

                                        if (video.gridVideoRenderer.thumbnailOverlays) {
                                            video.gridVideoRenderer.thumbnailOverlays.forEach(overlay => {
                                                if (overlay.thumbnailOverlayTimeStatusRenderer) {
                                                    videoData.duration = overlay.thumbnailOverlayTimeStatusRenderer.text.simpleText;
                                                }
                                            });
                                        }

                                        videoDataList.push(videoData);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            return {
                author: "xnil",
                status: 200,
                data: channelMetadata,
                last_upload_video: videoDataList[0]
            };
        } else {
            return {
                author: "xnil",
                status: 404,
                msg: "Data not found"
            };
        }
    } catch (error) {
        return {
            author: "xnil",
            status: 500,
            msg: error.message
        };
    }
}

async function ytdl2(url) {
  try {
    const response = await axios.post(
      'https://oo6o8y6la6.execute-api.eu-central-1.amazonaws.com/default/Upload-DownloadYoutubeLandingPage',
      JSON.stringify({
        url: url,
        app: "transkriptor",
        is_only_download: true
      }),
      {
        headers: {
          'authority': 'oo6o8y6la6.execute-api.eu-central-1.amazonaws.com',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'text/plain;charset=UTF-8',
          'origin': 'https://transkriptor.com',
          'referer': 'https://transkriptor.com/',
          'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    );

   const data = response.data.download_url;

    return {
      author: "xnil",
      status: 200,
      url: data,
      message: "Download Succes"
    };
  } catch (error) {
    console.error('❌ Error fetching video link:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function pindl(url) {
  try {
    const response = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`);
    const html = response.data;
    const $ = cheerio.load(html);

    let results = [];
    $('td.video-quality').each((index, element) => {
      const type = $(element).text().trim();
      const format = $(element).next().text().trim();
      const downloadLinkElement = $(element).nextAll().find('#submiturl').attr('href');

      if (downloadLinkElement) {
        let downloadLink = downloadLinkElement;
        if (downloadLink.startsWith('force-save.php?url=')) {
          downloadLink = decodeURIComponent(downloadLink.replace('force-save.php?url=', ''));
        }
        results.push({ type, format, downloadLink });
      }
    });

    const title = $('h1').text().trim();

    return {
      author: "xnil",
      status: 200,
        title,
        type: results[0].type,
        url: results[0].downloadLink,
        type2: results[0].type,
        url2: results[1].downloadLink
      
    };
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return { success: false, message: error.message };
  }
}


async function fbdl(url) {
  if (!url) {
    console.error('Error: No URL provided.');
    return null;
  }

  try {
    const response = await axios.post(
      'https://fbdownloaderhd.com/wp-json/aio-dl/video-data/',
      new URLSearchParams({
        'url': url,
        'token': '8233ce3364fb7a3ba1d7c31995e559b7c34af3d063276e3f5d38150d724005d2',
        'hash': 'aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlL3YvMTVWcDhHV1ZuaC8=1044YWlvLWRs'
      }),
      {
        headers: {
          'authority': 'fbdownloaderhd.com',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cookie': 'pll_language=en; PHPSESSID=dt61lnkqvt751rifu25depllmh; FCNEC=%5B%5B%22AKsRol9nkDGOuNtj3WGA8OZ67gp9u-KFfExnRHP5UzXjux6GgQbj04PahO23EqwtkD1LDtOnRaFuerP0TUG_YyZ8EAXOKgGDF6aS7HZ_jKiCnMLYfSW8PRWG1ZD8851GrNQalaag5_wK3Xk4c3S84yh9-GhUIVOBzQ%3D%3D%22%5D%5D',
          'origin': 'https://fbdownloaderhd.com',
          'referer': 'https://fbdownloaderhd.com/facebook-video-downloader/',
          'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    const xnil = response.data;

    return {
      title: xnil.title,
      thumbnail: xnil.thumbnail,
      duration: xnil.duration,
      source: xnil.source,
      url: xnil.medias[0].url,
      hd: xnil.medias[1],
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return null;
  }
}


const utils = {
	shortenURL,
	igdown,
  ttsave,
  savepin,
  likeedown,
  deepseek,
  ytStalk,
  ytdl2,
  pindl,
  fbdl
};

module.exports = utils;
