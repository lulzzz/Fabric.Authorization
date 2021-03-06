﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using Fabric.Authorization.API.Infrastructure;
using Fabric.Authorization.API.Services;
using Fabric.Authorization.UnitTests.Mocks;
using IdentityModel;
using Nancy;
using Xunit;

namespace Fabric.Authorization.UnitTests.Events
{
    public class EventContextResolverTests
    {
        [Fact]
        public void Resolves_Username()
        {
            var context = new NancyContext {CurrentUser = new TestPrincipal(new Claim(JwtClaimTypes.Name, "bob"))};
            var contextWrapper = new NancyContextWrapper(context);
            var eventContextResolver = new EventContextResolverService(contextWrapper);
            Assert.Equal("bob", eventContextResolver.Username);
        }

        [Fact]
        public void Resolves_Subject()
        {
            var context = new NancyContext { CurrentUser = new TestPrincipal(new Claim(JwtClaimTypes.Subject, "12345")) };
            var contextWrapper = new NancyContextWrapper(context);
            var eventContextResolver = new EventContextResolverService(contextWrapper);
            Assert.Equal("12345", eventContextResolver.Subject);
        }

        [Fact]
        public void Resolves_ClientId()
        {
            var context = new NancyContext { CurrentUser = new TestPrincipal(new Claim(JwtClaimTypes.ClientId, "fabric-authorization")) };
            var contextWrapper = new NancyContextWrapper(context);
            var eventContextResolver = new EventContextResolverService(contextWrapper);
            Assert.Equal("fabric-authorization", eventContextResolver.ClientId);
        }

        [Fact]
        public void Resolves_IpAddress()
        {
            var request = new Request("POST", "http://test/test", null, null, "192.168.0.1");
            var context = new NancyContext {Request = request};
            var contextWrapper = new NancyContextWrapper(context);
            var eventContextResolver = new EventContextResolverService(contextWrapper);
            Assert.Equal("192.168.0.1", eventContextResolver.RemoteIpAddress);
        }

        [Fact]
        public void ResolvesAllToNull_IfNotSpecified()
        {
            var context = new NancyContext { CurrentUser = new TestPrincipal() };
            var contextWrapper = new NancyContextWrapper(context);
            var eventContextResolver = new EventContextResolverService(contextWrapper);
            Assert.Null(eventContextResolver.Username);
            Assert.Null(eventContextResolver.Subject);
            Assert.Null(eventContextResolver.ClientId);
            Assert.Null(eventContextResolver.RemoteIpAddress);
        }

    }
}
