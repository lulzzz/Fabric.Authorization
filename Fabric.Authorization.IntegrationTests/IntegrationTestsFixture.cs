﻿using System;
using System.Threading;
using Fabric.Authorization.API.Configuration;
using Fabric.Authorization.API.Services;
using Fabric.Authorization.Domain.Stores;
using Moq;
using Nancy.Testing;
using Serilog;

namespace Fabric.Authorization.IntegrationTests
{
    public class IntegrationTestsFixture : IDisposable
    {
        public Browser Browser { get; set; }

        public ILogger Logger { get; set; } = new Mock<ILogger>().Object;

        private IDocumentDbService dbService;

        private readonly string CouchDbServerEnvironmentVariable = "COUCHDBSETTINGS__SERVER";

        protected IDocumentDbService DbService()
         {
             if (dbService == null)
             {
                 ICouchDbSettings config = new CouchDbSettings()
                 {
                     DatabaseName = "integration-"+DateTime.UtcNow.Ticks.ToString(),
                     Username = "",
                     Password = "",
                     Server = "http://127.0.0.1:5984"
                 };

                 var couchDbServer = Environment.GetEnvironmentVariable(CouchDbServerEnvironmentVariable);
                 if (!string.IsNullOrEmpty(couchDbServer))
                 {
                     config.Server = couchDbServer;
                 }

                 dbService = new CouchDbAccessService(config, new Mock<ILogger>().Object);
             }

             return dbService;
         }

        #region IDisposable implementation

        // Dispose() calls Dispose(true)
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~IntegrationTestsFixture()
        {
            // Finalizer calls Dispose(false)
            Dispose(false);
        }

        // The bulk of the clean-up code is implemented in Dispose(bool)
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                //this.Browser = null;
            }
        }

        #endregion IDisposable implementation
    }
}