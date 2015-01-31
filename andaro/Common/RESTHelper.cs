using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Http;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.IO;
using System.Text;

namespace andaro.Common
    {

    public static class Enumeration
        {
        public enum RestOperationType
            {
            POST,
            PUT,
            DELETE,
            GET
            }

        public enum ContentType
            {
            Json,
            Xml
            }
        }

    public class RESTHelper
        {
        public T1 SendHTTPReportRequest<T, T1>(string token, string RESTServer, Enumeration.RestOperationType restOperation, string parameters, Enumeration.ContentType acceptType, Enumeration.ContentType contentType, T objContent)
            {
            T1 httpReport;

            using (HttpClient client = new HttpClient(RESTServer))
                {

                string createUrl = string.Format("{0}{1}", RESTServer, parameters);
                using (HttpRequestMessage request = new HttpRequestMessage(restOperation.ToString(), createUrl))
                    {
                    //Add the authentication header
                    if (!String.IsNullOrEmpty(token))
                        {
                        string AuthContent = string.Format("TOK:{0}", token);
                        request.Headers.Add("Authorization", AuthContent);
                        }

                    if (acceptType == Enumeration.ContentType.Xml)
                        request.Headers.Accept.AddString("application/xml");
                    if (acceptType == Enumeration.ContentType.Json)
                        request.Headers.Accept.AddString("application/json");

                    HttpContent content = null;

                    if ((restOperation != Enumeration.RestOperationType.GET) && (restOperation != Enumeration.RestOperationType.DELETE))
                        {
                        if (contentType == Enumeration.ContentType.Xml)
                            content = HttpContentExtensions.CreateDataContract<T>(objContent);
                        if (contentType == Enumeration.ContentType.Json)
                            content = HttpContentExtensions.CreateJsonDataContract<T>(objContent);

                        request.Content = content;
                        }

                    httpReport = this.SendRESTCall<T1>(client, request);
                    }
                }
            return httpReport;
            }


        private T1 SendRESTCall<T1>(HttpClient client, HttpRequestMessage request)
            {
            T1 httpReport = default(T1);

            try
                {
                using (HttpResponseMessage response = client.Send(request))
                    {
                    response.EnsureStatusIsSuccessful();
                    using (MemoryStream memoryStream = new MemoryStream())
                        {
                        string responseContent = response.Content.ReadAsString();
                        byte[] bytes = Encoding.Unicode.GetBytes(responseContent);
                        memoryStream.Write(bytes, 0, bytes.Length);
                        memoryStream.Position = 0;
                        DataContractJsonSerializer dataContractJsonSerializer = new DataContractJsonSerializer(typeof(T1));
                        httpReport = (T1)dataContractJsonSerializer.ReadObject(memoryStream);
                        memoryStream.Close();
                        }
                    }
                }
            catch (Exception e)
                {

                //Logger.Log(LogLevel.Error, (e.InnerException != null) ? e.InnerException.Message : e.Message);
                throw e;
                }

            return httpReport;
            }



        public T GetRequest<T>(string token, string RESTServer, string parameters, Enumeration.ContentType acceptType)
            {
            T lstResult;

            lstResult = SendHTTPReportRequest<string, T>(token, RESTServer, Enumeration.RestOperationType.GET, parameters, acceptType, Enumeration.ContentType.Json, null);
            return lstResult;
            }

        public T GetJasonRequest<T>(string token, string RESTServer, string parameters)
            {
            T result = GetRequest<T>(token, RESTServer, parameters, Enumeration.ContentType.Json);
            return result;
            }

        public T GetJasonRequest<T>(string RESTServer, string parameters)
            {
            T result = GetRequest<T>(null, RESTServer, parameters, Enumeration.ContentType.Json);
            return result;
            }
        }
    }