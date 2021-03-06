CREATE TABLE [dbo].[SecurableItems](
	[SecurableItemId] [uniqueidentifier] NOT NULL,
	[CreatedBy] [nvarchar](max) NOT NULL,
	[CreatedDateTimeUtc] [datetime] NOT NULL,
	[GrainId] [uniqueidentifier] NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedDateTimeUtc] [datetime] NULL,
	[Name] [nvarchar](200) NOT NULL,
	[ClientOwner] [nvarchar](200) NOT NULL,
	[ParentId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_SecurableItems] PRIMARY KEY NONCLUSTERED 
(
	[SecurableItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [HCFabricAuthorizationData1]
) ON [HCFabricAuthorizationData1] TEXTIMAGE_ON [HCFabricAuthorizationData1]
GO

CREATE UNIQUE CLUSTERED INDEX [IX_SecurableItems_Id] ON [dbo].[SecurableItems]
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [HCFabricAuthorizationData1]
GO

CREATE NONCLUSTERED INDEX [IX_SecurableItems_GrainId] ON [dbo].[SecurableItems]
(
	[GrainId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [HCFabricAuthorizationIndex1]
GO

CREATE NONCLUSTERED INDEX [IX_SecurableItems_ParentId] ON [dbo].[SecurableItems]
(
	[ParentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [HCFabricAuthorizationIndex1]
GO

ALTER TABLE [dbo].[SecurableItems] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO

ALTER TABLE [dbo].[SecurableItems]  WITH CHECK ADD  CONSTRAINT [FK_SecurableItems_Grain_GrainId] FOREIGN KEY([GrainId])
REFERENCES [dbo].[Grains] ([GrainId])
GO

ALTER TABLE [dbo].[SecurableItems] CHECK CONSTRAINT [FK_SecurableItems_Grain_GrainId]
GO

ALTER TABLE [dbo].[SecurableItems]  WITH CHECK ADD  CONSTRAINT [FK_SecurableItems_SecurableItems_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[SecurableItems] ([SecurableItemId])
GO

ALTER TABLE [dbo].[SecurableItems] CHECK CONSTRAINT [FK_SecurableItems_SecurableItems_ParentId]
GO
