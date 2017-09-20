﻿using System;

namespace Fabric.Authorization.API.RemoteServices.Identity.Models
{
    /// <summary>
    /// Represents the response from Fabric.Identity when searching for user(s) by
    /// 1 or more subject IDs.
    /// </summary>
    public class UserSearchResponse
    {
        public string SubjectId { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
    }
}