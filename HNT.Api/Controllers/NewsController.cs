using HNT.Api.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace HNT.Api.Controllers
{
    public class NewsController : ApiController
    {
        private static readonly Uri _BaseUri = new Uri("https://hacker-news.firebaseio.com");
        private string _ApiVersion = "v0";

        // GET: api/news/newstories/10/1
        [Route("api/news/{listName}/{pageSize}/{pageNumber}")]
        public async Task<IEnumerable<HntItem>> Get(string listName, int pageSize, int pageNumber)
        {
            var uri = GetListUriByListName(listName);
            var ids = await DownloadObjectAsync<int[]>(uri);
            return await GetItemsByIdListAsync(ids.Skip(pageSize * pageNumber).Take(pageSize));
        }

        // GET: api/news/1234/kids
        [Route("api/news/{id}/kids")]
        public async Task<IEnumerable<HntItem>> GetKids(int id)
        {
            var news = await GetItemByIdAsync(id);
            if (news.Kids == null || news.Kids.Count == 0)
            {
                return new HntItem[] { };
            }
            return await GetItemsByIdListAsync(news.Kids);
        }

        // GET: api/news/1234
        [Route("api/news/{id}")]
        public async Task<HntItem> Get(int id)
        {
            return await GetItemByIdAsync(id);
        }

        private async Task<IEnumerable<HntItem>> GetItemsByIdListAsync(IEnumerable<int> ids)
        {
            IEnumerable<Task<HntItem>> allTasks =
                ids.ToList().Select(id => GetItemByIdAsync(id));
            return await Task.WhenAll(allTasks);
        }

        private async Task<HntItem> GetItemByIdAsync(int id)
        {
            var uri = GetNewsUriById(id);
            return await DownloadObjectAsync<HntItem>(uri);
        }

        private static async Task<T> DownloadObjectAsync<T>(Uri uri)
        {
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(uri);
                string json = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(json);
            }
        }

        private Uri GetNewsUriById(int id)
        {
            return new Uri(_BaseUri,
                string.Format(@"{0}/item/{1}.json", _ApiVersion, id.ToString()));
        }

        private Uri GetListUriByListName(string listName)
        {
            return new Uri(_BaseUri,
                string.Format(@"{0}/{1}.json", _ApiVersion, listName));
        }
    }
}
