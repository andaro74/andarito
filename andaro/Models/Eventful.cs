using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace andaro.Models
    {
    public class Eventful
        {
        public string venue_id { get; set; }
        public string title { get; set; }
        public string venue_name { get; set; }
        public string venue_url { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string description { get; set; }
        public string venue_address { get; set; }
        public string start_time { get; set; }
        public string stop_time { get; set; }
        public string description_teaser { get; set; }
        }

    public class EventLocation
        {
        public int order { get; set; }
        public string venue_id { get; set; }
        public string venue_name { get; set; }
        public string venue_url { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string venue_address { get; set; }

        private string _urllocation;
        public string urllocation
            {
            get
                {
                return _urllocation;
                }
            set
                {
                _urllocation = value;
                }
            }

        private List<Event> _events = new List<Event>();
        public List<Event> events
            {
            get
                {
                return _events;
                }
            set
                {
                _events = value;
                }
            }
        }

    public class Event
        {
        public string venue_id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string start_time { get; set; }
        public string stop_time { get; set; }
        public string description_teaser { get; set; }
        }
    }