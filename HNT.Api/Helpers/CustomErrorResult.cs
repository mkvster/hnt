using StackExchange.Exceptional;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace HNT.Api.Helpers
{
    public class CustomErrorResult : IHttpActionResult
    {
        private readonly string _errorMessage;
        private readonly HttpRequestMessage _requestMessage;
        private readonly HttpStatusCode _statusCode;

        public CustomErrorResult(HttpRequestMessage requestMessage,
           HttpStatusCode statusCode, string errorMessage)
        {
            _requestMessage = requestMessage;
            _statusCode = statusCode;
            _errorMessage = errorMessage;
            LogToStore();
        }

        public Task<HttpResponseMessage> ExecuteAsync(
           CancellationToken cancellationToken)
        {
            return Task.FromResult(_requestMessage.CreateErrorResponse(
                _statusCode, _errorMessage));
        }

        public void LogToStore()
        {
            var customErrorMessage = new Dictionary<string, string>();
            customErrorMessage.Add("RequestMessage", _requestMessage.ToString());
            customErrorMessage.Add("StatusCode", _statusCode.ToString());
            customErrorMessage.Add("ErrorMessage", _errorMessage);

            ErrorStore.LogException(new Exception(_errorMessage), 
                HttpContext.Current, true, false, 
                customErrorMessage, "HTN.Api");
        }
    }
}
