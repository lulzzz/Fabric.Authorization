﻿using System;
using System.Collections.Generic;
using Fabric.Authorization.Domain.Models;

namespace Fabric.Authorization.Persistence.SqlServer.EntityModels
{
    public class Permission : ITrackable, ISoftDelete
    {
        public Permission()
        {
            RolePermissions = new List<RolePermission>();
            UserPermissions = new List<UserPermission>();
        }

        public int Id { get; set; }
        public int SecurableItemId { get; set; }

        public Guid ExternalIdentifier { get; set; }
        public string Grain { get; set; }

        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime? ModifiedDateTimeUtc { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }

        public SecurableItem SecurableItem { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; }
        public ICollection<UserPermission> UserPermissions { get; set; }
    }
}