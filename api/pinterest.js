const axios = require('axios');

exports.config = {
    name: 'pinterest',
    author: 'xnil6x',
    description: 'Search for Pinterest pins based on a query',
    method: 'get',
    category: 'search',
    link: ['/pinterest?title=&count=']
};

exports.onStart = async function ({ req, res }) {
    try {
        const searchTitle = req.query.title;
        const count = parseInt(req.query.count) || 10;

        if (!searchTitle) {
            return res.json({ error: 'Missing title parameter to execute the command' });
        }

        const headers = {
            'authority': 'www.pinterest.com',
            'cache-control': 'max-age=0',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'sec-gpc': '1',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'same-origin',
            'sec-fetch-dest': 'empty',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': 'csrftoken=7c91c00c62d4664c8dcb7afdbf037cd5; g_state={"i_l":0}; _auth=1; _b="AYQjEcw57ZFOCI4lmEoaRiIKU/yQYOLVTqPH11EwDVmxBFOkzwiMqjwysvXFGtIyfoI="; __Secure-s_a=T0lqOEwzTGhJc0tOdzRuUE5VUGRxdm9SNmdadkR3ak1wd01rV3k5ODdDdlMweTNxU2xneUhxWXAzVE9XVTV2T01aVXBRSThwQ3lXM1dteU5IZ3JpWVp2enlBY2NFZEk1b0p6ZE14cXRqMllWY3grMHY4YUtVemloNXhidUdjeFhQWUprdGIvL3c1WmU5S3MrOVErL1FIYzA4cjFMc2dYbWZzbkJocWRnS0NLZnIxdlpEa0FFUUwyNDdSTENoejBGc3hsemVINDE4UG1jSnRZT3dvRzRRcDJnNU9jdU43NkwxdFNXUTRvNk5FOTlySExkRE1IVEMxZTRCdTAydFZGRGI4K1RBR1ZxZ1dWNEwwL1dFVnV0dUlsbndGWW9uUTRaazR3WEt4a0U1dE5Eb1h1NGtDaDhHR01WVXpKVWowdU11SHpJVU92NC9oNFhWTHcxSllsVGFmRGhiMzZRbmk2VWpjMDdxcEl4THZSRFJ4Y0M0STQwMGpRN2xmS3lyUkRPYWFSa1lXZzZ6NThjQk5mTjEwa1JrL2Q5RCtEUmY1VTc0aFd3VTBKM2tKaCtxY3N0dnhKOWZCY2ovRFdkeVlyMFI5cXpnSEZoejgwMWVsUGlzNGd5dnptcGFka1d3QWtTQXBmeTEyakxjcW1iS3pmRlgyZDlvbUVyZTdONkkwYm9tM0FzT0RXeTJsNnFEZ1VsbnpSZVNhbVVLeklLSHhteXVEdlJPT1NQYUJzUGFlei80UWZXMVkySDQ1U1lQL095OFFnSUEzOHRRcXIxTGpMbWJRN3VwdTlzUktEdy93b0w4Z084MExIQ3dDeXkvemxpOU5mYkZLemtnVXJucEVBSjJLUzBuT1pFN2hHZGdhb3BWQVl1MjVHU3Q2QmVKU3cwMlBhRERGQUlXZ0xvRVdXVnR0N2ZGWTY3VHBzdVFZVmFCeEhZQWxqK29xSjM3ZHdZVGE4bE4xOHNxQnZna01vRms0RjdVb25FZVBPZW5Id1V0cS84NFVlU0tkZ05HSVljM3VCdWdKU3dsTHR2UkpXNTljNWlPcy9uaGJsdFhiejROaDRLTmtPVFQ4SlpzSG1ZeWdYbldOYXRGb0dkV2VydXQyODFNeFNjZVlxVzBjdUlDUCtwdWNnVFRlcGJSSldpL2RuTFAzcnorb1RiYlNHSzBGZWQ2b1JhWGhSNkVmV2ZPZG1rZVVudTZ6Z1pLY2lPcTZQNnV6eXVCRTRLYVMvd3lld1NRRE43SDB1RUkyNVM1VkpSNkc3bm5USVp6QS9HaWsyK3BhV3FGTkNHZkZOdzNRMThXdlpsbk9CRlJsNk5IOVgrOE1FR3JYaz0mbGtSK1lVY0M3QUNKUUZ4WXp5eVVXSmVDVWZvPQ==; _pinterest_sess=TWc9PSZNNUV3cnJ3WUhham5FOVpSdW1LVFhtYzBVR1k2ZnlwNkliV1VqSU0vMExUZzA3dXJubncrUHVBRUc1S0FKZ1ZteEdmdHMyNWxWcjhrckRZL2U3WWZ0NS9oZ3Ywc2NaYlQ0dzNTcWdUQzFTMXllbE1OZ09HbjBpRGVGYWRETzhNSXBhSEtycU9lN0ZOalIxL2ZSVzMweGoyckRISkwvSzRJbTBuMENRcTF0L0E1Zm91b2k3VEpZRzZhUnlVMWJZS0NQS2dybjlvbkFhcklxVTZxUERBTzY1NVdaZGw0OVhEMHp6MUJXc0Q4T1ptYzRQd0hndThtbnVhY1RYV1RMdHBlZ3pMSVhRT3BiZHpsSjA2VmRuWE14ZUZHOVVGM0treGRqSDB5ZnhVaWdwTUYxL2ZjSjlzWUdKWWFCQjQ4dEpEcWhMckNYa2RGY2FSRUJDTHFNTWw5ZmJJMnpqa05nNy9EQ1dSdFBOZ1IxWXIwdldyakNtcCtCeWt6N0owejBaQ2NJSy83RVd2NlpxRklUTHF0NGdjSkFBand0Q0h1aDdZUlZTWXJJZXljaDNEcjVlTEN0VmlsMHZtdzBwK2NrQ3lDemc5dkhtK3R4K3IyNkhGR2JZdEcvZElFQXRRNE9nOGVmZDA4WGNvR0hvb3Z3UC9hQ256WG5YN2JkYmlVQ0Roejk3L0lvY2FpNzlJbUpaNGlyNkJmRnZXdmJuWGptbjhMMkhYL1JEOUs0NTd1V0dtdHZDZUhCWkMxNks3Q05DUHBNSFFOYUpHaGo4L1BrdkpreFBDSENSaFM1ZFA5ZzRsV1h6RzBUclNEQWU1SHhneGF5bFZFbVloZTN0b1NPTHdxVHhJblJtRW0zQ2Q3VmpVcDI5MmVpMWtKc3F6aldlSnp3VE9kdlVtajNROGNSUi9LNStkWTJncSt1NjNvL21Cb3N0djhYZE1YTEFmaG42MXhjYmZlaTF6WGlPalRoMzZyWmlKZjMzZE16cThqMVVjd04rRy9NTGd0UWtuWExpei9vM1BpbEpPVzhqeXR0aEVjZ2FpdnEwUHA4LzQ4RjFYOVdTbFZFdFR3a1lpbnVjc2trRE5tYVJQODV5VTJqU2k2VXUwejZNakozUXUybnRNMkJ1MlNqSHYzbTdVeU5jdEd3a3I4emxwUGgxenRKU01hRVJSRVJ4RTZmTzgrY3o3d3p3TXByWGNROFNnTG1DODduQWlSMDllckhJNlRyRlpHYi9HdXh6bW5vanIyR3VhK0c5UG94ckplZllqc3NnNndXNS94MzBLdXZHaDlsMGRUZ2ViT1c4c0QxclJod3IxL283a3lBcldtVUJkV3A0WWRuRjdwN2FHai9HeVg2QXYvS3ZPUWhqMEtZenFZM2xIM1ZXTFNYc1JJK2xFL3lJWFZvUytEWWpqK082eGZKM3hBY3l6emUyZkxVQTB0QktGOTVqY0NuWmRLa21DWFhGaE5QaW9QUzJlc1UzRktuWnl1TlpVL1NKSWdjSlhUWkRCRU9DR2VuTkdTNXRnMnNoQjE3QmhLa1R0U04raXhaWC9CSDlONkNHUytzNThtYjFEY1N4R1o4S2wxazFDdVFrQTZjcUhEc25scFFGTG9kaE1GVGQxT2k3M1FBT0dvNEZtbkVuV0NZUm9nK0d2eGszSTRicFl5QTlBblFDMUIwblI5L3BmK3VPYmxiK3hRZUlXL05lcmttcHNYM2g3ZXk5Rys1VHBWRWhLRFFHMkNnUC9SRlJZazB1eE1sdDRBVldVb0kwU0lBaWtyQnJJUHplMDgmazZxZ3RYanArWnFaVStGcXpidVFGOHMvQlFjPQ==; _pinterest_referrer=https://www.google.com/; _routing_id="5a1daae5-8b3e-448c-9813-7140cc242295"; sessionFunnelEventLogged=1',
        };

        const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTitle)}&rs=typed&term_meta[]=${encodeURIComponent(searchTitle)}%7Ctyped`;

        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            const matches = response.data.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
            const limitedResults = matches ? matches.slice(0, count) : [];

            return res.json({
                count: limitedResults.length,
                data: limitedResults
            });
        } else {
            return res.status(500).json({ error: 'Failed to fetch Pinterest results' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred', details: error.message });
            }
};
