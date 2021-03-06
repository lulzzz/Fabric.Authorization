﻿using Fabric.Authorization.API.Configuration;
using Fabric.Authorization.Domain.Services;
using Fabric.Authorization.Domain.Stores;
using Fabric.Authorization.Persistence.SqlServer.Services;
using Fabric.Authorization.Persistence.SqlServer.Stores;
using Nancy.TinyIoc;

namespace Fabric.Authorization.API.DependencyInjection
{
    public class SqlServerConfigurator : IPersistenceConfigurator
    {
        private readonly IAppConfiguration _appConfiguration;

        public SqlServerConfigurator(IAppConfiguration appConfiguration)
        {
            _appConfiguration = appConfiguration;
        }

        public void ConfigureApplicationInstances(TinyIoCContainer container)
        {
            container.Register<IDbBootstrapper, SqlServerDbBootstrapper>().AsMultiInstance();
            container.Register<IAuthorizationDbContext, AuthorizationDbContext>().AsMultiInstance();
            container.Register<IEventContextResolverService, NoOpEventContextResolverService>().AsMultiInstance();
            container.Register(_appConfiguration.ConnectionStrings);
        }

        public void ConfigureRequestInstances(TinyIoCContainer container)
        {
            container.Register<IAuthorizationDbContext, AuthorizationDbContext>();
            container.Register<IRoleStore, SqlServerRoleStore>();
            container.Register<IUserStore, SqlServerUserStore>();
            container.Register<IPermissionStore, SqlServerPermissionStore>();
            container.Register<IGroupStore, SqlServerGroupStore>();
            container.Register<IClientStore, SqlServerClientStore>();
            container.Register<IGrainStore, SqlServerGrainStore>();
            container.Register<ISecurableItemStore, SqlServerSecurableItemStore>();
        }
    }
}
