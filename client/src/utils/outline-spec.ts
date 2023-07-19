export default {
	openapi: '3.0.0',
	info: {
		title: 'Outline API',
		description:
			'# Introduction\n\nThe Outline API is structured in an RPC style. It enables you to\nprogramatically interact with all aspects of Outline’s data – in fact, the\nmain application is built on exactly the same API.\n\nThe API structure is available as an \n[openapi specification](https://github.com/outline/openapi) if that’s your \njam – it can be used to generate clients for most programming languages.\n\n# Making requests\n\nOutline’s API follows simple RPC style conventions where each API endpoint is\na method on `https://app.getoutline.com/api/method`. Both `GET` and `POST` \nmethods are supported but it’s recommended that you make all call using POST.\nOnly HTTPS is supported and all response payloads are JSON.\n\nWhen making `POST` requests, request parameters are parsed depending on\nContent-Type header. To make a call using JSON payload, you must pass\nContent-Type: application/json header, here’s an example using CURL:\n\n```\ncurl https://app.getoutline.com/api/documents.info \\\n-X \'POST\' \\\n-H \'authorization: Bearer MY_API_KEY\' \\\n-H \'content-type: application/json\' \\\n-H \'accept: application/json\' \\\n-d \'{"id": "outline-api-NTpezNwhUP"}\'\n```\n\nOr, with JavaScript:\n\n```javascript\nconst response = await fetch("https://app.getoutline.com/api/documents.info", {\n  method: "POST",\n  headers: {\n    Accept: "application/json",\n    "Content-Type": "application/json",\n    Authorization: \'Bearer MY_API_KEY\'\n  }\n})\n\nconst body = await response.json();\nconst document = body.data;\n```\n\n# Authentication\n\nTo access API endpoints, you must provide a valid API key. You can create new\nAPI keys in your [account settings](https://app.getoutline.com/settings). Be\ncareful when handling your keys as they give access to all of your documents,\nyou should treat them like passwords and they should never be committed to\nsource control.\n\nTo authenticate with API, you can supply the API key as a header\n(`Authorization: Bearer YOUR_API_KEY`) or as part of the payload using `token` \nparameter. Header based authentication is highly recommended so that your keys\ndon’t accidentally leak into logs.\n\nSome API endpoints allow unauthenticated requests for public resources and\nthey can be called without an API key.\n\n# Errors\n\nAll successful API requests will be returned with a 200 or 201 status code\nand `ok: true` in the response payload. If there’s an error while making the\nrequest, the appropriate status code is returned with the error message:\n\n```\n{\n  "ok": false,\n  "error: "Not Found"\n}\n```\n\n# Pagination\n\nMost top-level API resources have support for "list" API methods. For instance,\nyou can list users, documents, and collections. These list methods share\ncommon parameters, taking both `limit` and `offset`.\n\nResponses will echo these parameters in the root `pagination` key, and also\ninclude a `nextPath` key which can be used as a handy shortcut to fetch the\nnext page of results. For example:\n\n```\n{\n  ok: true,\n  status: 200,\n  data: […],\n  pagination: {\n    limit: 25,\n    offset: 0,\n    nextPath: "/api/documents.list?limit=25&offset=25"\n  }\n}\n```\n\n# Policies\n\nMany API resources have associated "policies", these objects describe the\ncurrent API keys authorized actions related to an individual resource. It\nshould be noted that the policy "id" is identical to the resource it is\nrelated to, policies themselves do not have unique identifiers.\n\nFor most usecases of the API, policies can be safely ignored. Calling\nunauthorized methods will result in the appropriate response code – these are\nused in the main Outline UI to adjust which elements are visible.\n',
		version: '0.1.0',
		contact: {
			email: 'hello@getoutline.com'
		}
	},
	servers: [
		{
			url: 'https://app.getoutline.com/api',
			description: 'Production'
		}
	],
	security: [
		{
			http: []
		}
	],
	tags: [
		{
			name: 'Attachments',
			description:
				'`Attachments` represent a file uploaded to cloud storage. They are created \nbefore the upload happens from the client and store all the meta information\nsuch as file type, size, and location.\n'
		},
		{
			name: 'Auth',
			description:
				'`Auth` represents the current API Keys authentication details. It can be \nused to check that a token is still valid and load the IDs for the current\nuser and team.\n'
		},
		{
			name: 'Collections',
			description:
				'`Collections` represent grouping of documents in the knowledge base, they \noffer a way to structure information in a nested hierarchy and a level\nat which read and write permissions can be granted to individual users or\ngroups of users.\n'
		},
		{
			name: 'Documents',
			description:
				'`Documents` are what everything else revolves around. A document represents\na single page of information and always returns the latest version of the\ncontent. Documents are stored in [Markdown](https://spec.commonmark.org/)\nformatting.\n'
		},
		{
			name: 'Events',
			description:
				'`Events` represent an artifact of an action. Whether it is creating a user,\nediting a document, changing permissions, or any other action – an event\nis created that can be used as an audit trail or activity stream.\n'
		},
		{
			name: 'FileOperations',
			description:
				'`FileOperations` represent background jobs for importing or exporting files.\nYou can query the file operation to find the state of progress and any\nresulting output.\n'
		},
		{
			name: 'Groups',
			description:
				'`Groups` represent a list of users that logically belong together, for \nexample there might be groups for each department in your organization.\nGroups can be granted access to collections with read or write permissions.\n'
		},
		{
			name: 'Revisions',
			description:
				'`Revisions` represent a snapshop of a document at a point in time. They \nare used to keep tracking of editing and collaboration history – a document\ncan also be restored to a previous revision if neccessary.\n'
		},
		{
			name: 'Shares',
			description:
				'`Shares` represent authorization to view a document without being a member\nof the team. Shares are created in order to give access to documents publicly.\nEach user that shares a document will have a unique share object.\n'
		},
		{
			name: 'Users',
			description:
				'`Users` represent an individual with access to the knowledge base. Users\ncan be created automatically when signing in with SSO or when a user is\ninvited via email.\n'
		},
		{
			name: 'Views',
			description:
				'`Views` represent a compressed record of an individual users views of a\ndocument. Individual views are not recorded but a first, last and total \nis kept per user.\n'
		}
	],
	paths: {
		'/attachments.create': {
			post: {
				tags: ['Attachments'],
				summary: 'Create an attachment',
				description:
					'Creating an attachment object creates a database record and returns the inputs needed to generate a signed url and upload the file from the client to cloud storage.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										example: 'image.png'
									},
									documentId: {
										type: 'string',
										description: 'Identifier for the associated document, if any.',
										format: 'uuid'
									},
									contentType: {
										type: 'string',
										example: 'image/png'
									},
									size: {
										type: 'number',
										description: 'Size of the file attachment in bytes.'
									}
								},
								required: ['name', 'contentType', 'size']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												maxUploadSize: {
													type: 'number'
												},
												uploadUrl: {
													type: 'string',
													format: 'uri'
												},
												form: {
													type: 'object'
												},
												attachment: {
													$ref: '#/components/schemas/Attachment'
												}
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/attachments.redirect': {
			post: {
				tags: ['Attachments'],
				summary: 'Retrieve an attachment',
				description:
					'Load an attachment from where it is stored based on the id. If the attachment is private then a temporary, signed url with embedded credentials is generated on demand.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the attachment.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'302': {
						description: 'The url for the attachment'
					}
				}
			}
		},
		'/attachments.delete': {
			post: {
				tags: ['Attachments'],
				summary: 'Delete an attachment',
				description:
					'Deleting an attachment is permanant. It will not delete references or links to the attachment that may exist in your documents.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid',
										description: 'Unique identifier for the attachment.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/auth.info': {
			post: {
				tags: ['Auth'],
				summary: 'Retrieve auth',
				description: 'Retrieve authentication details for the current API key',
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Auth'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					}
				}
			}
		},
		'/auth.config': {
			post: {
				tags: ['Auth'],
				summary: 'Retrieve auth config',
				description: 'Retrieve authentication options',
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												name: {
													type: 'string',
													example: 'Acme Inc'
												},
												hostname: {
													type: 'string',
													example: 'acme-inc.getoutline.com'
												},
												services: {
													type: 'array',
													items: {
														type: 'object',
														properties: {
															id: {
																type: 'string',
																example: 'slack'
															},
															name: {
																type: 'string',
																example: 'Slack'
															},
															authUrl: {
																type: 'string',
																example: 'https://acme-inc.getoutline.com/auth/slack'
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/collections.info': {
			post: {
				tags: ['Collections'],
				summary: 'Retrieve a collection',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the collection.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Collection'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.documents': {
			post: {
				tags: ['Collections'],
				summary: 'Retrieve a collections document structure',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the collection.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/NavigationNode'
											},
											example: []
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.list': {
			post: {
				tags: ['Collections'],
				summary: 'List all collections',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Pagination'
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Collection'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/collections.create': {
			post: {
				tags: ['Collections'],
				summary: 'Create a collection',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										example: 'Human Resources'
									},
									description: {
										type: 'string',
										example: ''
									},
									permission: {
										$ref: '#/components/schemas/Permission'
									},
									color: {
										type: 'string',
										example: '#123123'
									},
									private: {
										type: 'boolean',
										example: false
									}
								},
								required: ['name']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Collection'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/collections.update': {
			post: {
				tags: ['Collections'],
				summary: 'Update a collection',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									name: {
										type: 'string',
										example: 'Human Resources'
									},
									permission: {
										$ref: '#/components/schemas/Permission'
									},
									description: {
										type: 'string',
										example: ''
									},
									color: {
										type: 'string',
										example: '#123123'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Collection'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.add_user': {
			post: {
				tags: ['Collections'],
				summary: 'Add a collection user',
				description: 'This method allows you to add a user membership to the specified collection.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									userId: {
										type: 'string',
										format: 'uuid'
									},
									permission: {
										$ref: '#/components/schemas/Permission'
									}
								},
								required: ['id', 'userId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												users: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/User'
													}
												},
												memberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Membership'
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.remove_user': {
			post: {
				tags: ['Collections'],
				summary: 'Remove a collection user',
				description: 'This method allows you to remove a user from the specified collection.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Identifier for the collection',
										format: 'uuid'
									},
									userId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id', 'userId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.memberships': {
			post: {
				tags: ['Collections'],
				summary: 'List all collection memberships',
				description:
					"This method allows you to list a collections individual memberships. It's important to note that memberships returned from this endpoint do not include group memberships.",
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										type: 'object',
										properties: {
											id: {
												type: 'string',
												description: 'Identifier for the collection',
												format: 'uuid'
											},
											query: {
												type: 'string',
												description: 'Filter memberships by user names',
												example: 'jenny'
											},
											permission: {
												$ref: '#/components/schemas/Permission'
											}
										},
										required: ['id']
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												users: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/User'
													}
												},
												memberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Membership'
													}
												}
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/collections.add_group': {
			post: {
				tags: ['Collections'],
				summary: 'Add a group to a collection',
				description:
					'This method allows you to give all members in a group access to a collection.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									groupId: {
										type: 'string',
										format: 'uuid'
									},
									permission: {
										$ref: '#/components/schemas/Permission'
									}
								},
								required: ['id', 'groupId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												collectionGroupMemberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/CollectionGroupMembership'
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.remove_group': {
			post: {
				tags: ['Collections'],
				summary: 'Remove a collection group',
				description:
					'This method allows you to revoke all members in a group access to a collection. Note that members of the group may still retain access through other groups or individual memberships.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Identifier for the collection',
										format: 'uuid'
									},
									groupId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id', 'groupId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.group_memberships': {
			post: {
				tags: ['Collections'],
				summary: 'List all collection group members',
				description:
					'This method allows you to list a collections group memberships. This is the list of groups that have been given access to the collection.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										type: 'object',
										properties: {
											id: {
												type: 'string',
												description: 'Identifier for the collection',
												format: 'uuid'
											},
											query: {
												type: 'string',
												description: 'Filter memberships by group names',
												example: 'developers'
											},
											permission: {
												$ref: '#/components/schemas/Permission'
											}
										},
										required: ['id']
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												groups: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Group'
													}
												},
												collectionGroupMemberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/CollectionGroupMembership'
													}
												}
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/collections.delete': {
			post: {
				tags: ['Collections'],
				summary: 'Delete a collection',
				description:
					'Delete a collection and all of its documents. This action can’t be undone so please be careful.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.export': {
			post: {
				tags: ['Collections'],
				summary: 'Export a collection',
				description:
					'Triggers a bulk export of the collection in markdown format and their attachments. If documents are nested then they will be nested in folders inside the zip file. The endpoint returns a `FileOperation` that can be queried to track the progress of the export and get the url for the final file.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									format: {
										type: 'string',
										enum: ['outline-markdown', 'json', 'html']
									},
									id: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												fileOperation: {
													$ref: '#/components/schemas/FileOperation'
												}
											}
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/collections.export_all': {
			post: {
				tags: ['Collections'],
				summary: 'Export all collections',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									format: {
										type: 'string',
										enum: ['outline-markdown', 'json', 'html']
									}
								}
							}
						}
					}
				},
				description:
					'Triggers a bulk export of all documents in and their attachments. The endpoint returns a `FileOperation` that can be queried through the fileOperations endpoint to track the progress of the export and get the url for the final file.',
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												fileOperation: {
													$ref: '#/components/schemas/FileOperation'
												}
											}
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.info': {
			post: {
				tags: ['Documents'],
				summary: 'Retrieve a document',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									},
									shareId: {
										type: 'string',
										format: 'uuid',
										description:
											'Unique identifier for a document share, a shareId may be used in place of a document UUID'
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.import': {
			post: {
				tags: ['Documents'],
				summary: 'Import a file as a document',
				description:
					'This method allows you to create a new document by importing an existing file. By default a document is set to the collection root. If you want to create a nested/child document, you should pass parentDocumentId to set the parent document.',
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									file: {
										type: 'object',
										description: 'Only plain text, markdown, docx, and html format are supported.'
									},
									collectionId: {
										type: 'string',
										format: 'uuid'
									},
									parentDocumentId: {
										type: 'string',
										format: 'uuid'
									},
									template: {
										type: 'boolean'
									},
									publish: {
										type: 'boolean'
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.export': {
			post: {
				tags: ['Documents'],
				summary: 'Export a document as markdown',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'string',
											description: 'The document content in Markdown formatting'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.list': {
			post: {
				tags: ['Documents'],
				summary: 'List all documents',
				description:
					'This method will list all published documents and draft documents belonging to the current user.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									},
									{
										type: 'object',
										properties: {
											collectionId: {
												type: 'string',
												format: 'uuid',
												description: 'Optionally filter to a specific collection'
											},
											userId: {
												type: 'string',
												format: 'uuid'
											},
											backlinkDocumentId: {
												type: 'string',
												format: 'uuid'
											},
											parentDocumentId: {
												type: 'string',
												format: 'uuid'
											},
											template: {
												type: 'boolean',
												description: 'Optionally filter to only templates'
											}
										}
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Document'
											}
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.drafts': {
			post: {
				tags: ['Documents'],
				summary: 'List all draft documents',
				description: 'This method will list all draft documents belonging to the current user.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									},
									{
										type: 'object',
										properties: {
											collectionId: {
												type: 'string',
												description: 'A collection to search within',
												format: 'uuid'
											},
											dateFilter: {
												type: 'string',
												description:
													'Any documents that have not been updated within the specified period will be filtered out',
												example: 'month',
												enum: ['day', 'week', 'month', 'year']
											}
										}
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Document'
											}
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.viewed': {
			post: {
				tags: ['Documents'],
				summary: 'List all recently viewed documents',
				description: 'This method will list all documents recently viewed by the current user.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Document'
											}
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.search': {
			post: {
				tags: ['Documents'],
				summary: 'Search all documents',
				description:
					'This methods allows you to search your teams documents with keywords. Note that search results will be restricted to those accessible by the current access token.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										type: 'object',
										properties: {
											query: {
												type: 'string',
												example: 'hiring'
											},
											userId: {
												type: 'string',
												description:
													'Any documents that have not been edited by the user identifier will be filtered out',
												format: 'uuid'
											},
											collectionId: {
												type: 'string',
												description: 'A collection to search within',
												format: 'uuid'
											},
											includeArchived: {
												type: 'boolean'
											},
											includeDrafts: {
												type: 'boolean'
											},
											dateFilter: {
												type: 'string',
												description:
													'Any documents that have not been updated within the specified period will be filtered out',
												example: 'month',
												enum: ['day', 'week', 'month', 'year']
											}
										}
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													context: {
														type: 'string',
														description:
															'A short snippet of context from the document that includes the search query.',
														example: 'At Acme Inc our hiring practices are inclusive'
													},
													ranking: {
														type: 'number',
														description:
															'The ranking used to order search results based on relevance.',
														format: 'float',
														example: 1.1844109
													},
													document: {
														$ref: '#/components/schemas/Document'
													}
												}
											}
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.create': {
			post: {
				tags: ['Documents'],
				summary: 'Create a document',
				description:
					'This method allows you to create or publish a new document. By default a document is set to the collection root. If you want to create a nested/child document, you should pass parentDocumentId to set the parent document.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									title: {
										type: 'string',
										example: 'Welcome to Acme Inc'
									},
									text: {
										type: 'string',
										description: 'The body of the document, may contain markdown formatting.',
										example: '…'
									},
									collectionId: {
										type: 'string',
										format: 'uuid'
									},
									parentDocumentId: {
										type: 'string',
										format: 'uuid'
									},
									templateId: {
										type: 'string',
										format: 'uuid'
									},
									template: {
										type: 'boolean',
										description: 'Whether this document should be considered to be a template.'
									},
									publish: {
										type: 'boolean',
										description:
											'Whether this document should be immediately published and made visible to other team members.'
									}
								},
								required: ['title', 'collectionId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.update': {
			post: {
				tags: ['Documents'],
				summary: 'Update a document',
				description: 'This method allows you to modify an already created document',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									},
									title: {
										type: 'string',
										description: 'The title of the document.'
									},
									text: {
										type: 'string',
										description: 'The body of the document, may contain markdown formatting.',
										example: '…'
									},
									append: {
										type: 'boolean',
										description:
											'If true the text field will be appended to the end of the existing document, rather than the default behavior of replacing it. This is potentially useful for things like logging into a document.'
									},
									publish: {
										type: 'boolean',
										description:
											'Whether this document should be published and made visible to other team members, if a draft'
									},
									done: {
										type: 'boolean',
										description:
											'Whether the editing session has finished, this will trigger any notifications. This property will soon be deprecated.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.templatize': {
			post: {
				tags: ['Documents'],
				summary: 'Create a template from a document',
				description:
					'This method allows you to createa new template using an existing document as the basis',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/documents.star': {
			post: {
				tags: ['Documents'],
				summary: 'Star a document',
				description:
					'Starring a document gives it extra priority in the UI and makes it easier to find important information later.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.unstar': {
			post: {
				tags: ['Documents'],
				summary: 'Unstar a document',
				description:
					'Starring a document gives it extra priority in the UI and makes it easier to find important information later.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.unpublish': {
			post: {
				tags: ['Documents'],
				summary: 'Unpublish a document',
				description:
					'Unpublishing a document moves it back to a draft status and out of the collection.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.move': {
			post: {
				tags: ['Documents'],
				summary: 'Move a document',
				description:
					'Move a document to a new location or collection. If no parent document is provided, the document will be moved to the collection root.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									},
									collectionId: {
										type: 'string',
										format: 'uuid'
									},
									parentDocumentId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												documents: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Document'
													}
												},
												collections: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Collection'
													}
												}
											}
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.archive': {
			post: {
				tags: ['Documents'],
				summary: 'Archive a document',
				description:
					'Archiving a document allows outdated information to be moved out of sight whilst retaining the ability to optionally search and restore it later.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.restore': {
			post: {
				tags: ['Documents'],
				summary: 'Restore a document',
				description:
					'If a document has been archived or deleted, it can be restored. Optionally a revision can be passed to restore the document to a previous point in time.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									},
									revisionId: {
										type: 'string',
										format: 'uuid',
										description: 'Identifier for the revision to restore to.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Document'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/documents.delete': {
			post: {
				tags: ['Documents'],
				summary: 'Delete a document',
				description:
					'Deleting a document moves it to the trash. If not restored within 30 days it is permenantly deleted.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										example: 'hDYep1TPAM',
										description:
											'Unique identifier for the document. Either the UUID or the urlId is acceptable.'
									},
									permanent: {
										type: 'boolean',
										example: false,
										description:
											'If set to true the document will be destroyed with no way to recover rather than moved to the trash.'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/events.list': {
			post: {
				tags: ['Events'],
				summary: 'List all events',
				description:
					'Events are an audit trail of important events that happen in the knowledge base.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									},
									{
										type: 'object',
										properties: {
											name: {
												type: 'string',
												description:
													'Filter to a specific event, e.g. "collections.create". Event names are in the format "objects.verb"'
											},
											actorId: {
												type: 'string',
												format: 'uuid',
												description: 'Filter to events performed by the selected user'
											},
											documentId: {
												type: 'string',
												format: 'uuid',
												description: 'Filter to events performed in the selected document'
											},
											collectionId: {
												type: 'string',
												format: 'uuid',
												description: 'Filter to events performed in the selected collection'
											},
											auditLog: {
												type: 'boolean',
												description:
													'Whether to return detailed events suitable for an audit log. Without this flag less detailed event types will be returned.'
											}
										}
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Event'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/fileOperations.info': {
			post: {
				tags: ['FileOperations'],
				summary: 'Retrieve a file operation',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the file operation.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/FileOperation'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/fileOperations.redirect': {
			post: {
				tags: ['FileOperations'],
				summary: 'Retrieve the file',
				description:
					'Load the resulting file from where it is stored based on the id. A temporary, signed url with embedded credentials is generated on demand.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the file operation.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/octet-stream': {
								schema: {
									type: 'string',
									format: 'binary'
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/fileOperations.list': {
			post: {
				tags: ['FileOperations'],
				summary: 'List all file operations',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									},
									{
										type: 'object',
										properties: {
											type: {
												type: 'string',
												description: 'The type of fileOperation',
												example: 'export',
												enum: ['export', 'import']
											}
										},
										required: ['type']
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/FileOperation'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/groups.info': {
			post: {
				tags: ['Groups'],
				summary: 'Retrieve a group',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the group.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Group'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/groups.list': {
			post: {
				tags: ['Groups'],
				summary: 'List all groups',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Group'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/groups.create': {
			post: {
				tags: ['Groups'],
				summary: 'Create a group',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										example: 'Designers'
									}
								},
								required: ['name']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Group'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/groups.update': {
			post: {
				tags: ['Groups'],
				summary: 'Update a group',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									name: {
										type: 'string',
										example: 'Designers'
									}
								},
								required: ['id', 'name']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Group'
										},
										policies: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Policy'
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/groups.delete': {
			post: {
				tags: ['Groups'],
				summary: 'Delete a group',
				description:
					'Deleting a group will cause all of its members to lose access to any collections the group has previously been added to. This action can’t be undone so please be careful.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/groups.memberships': {
			post: {
				tags: ['Groups'],
				summary: 'List all group members',
				description: 'List and filter all the members in a group.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										type: 'object',
										properties: {
											query: {
												type: 'string',
												description: 'Filter memberships by user names',
												example: 'jenny'
											}
										},
										required: ['id']
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												users: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/User'
													}
												},
												groupMemberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/GroupMembership'
													}
												}
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/groups.add_user': {
			post: {
				tags: ['Groups'],
				summary: 'Add a group member',
				description: 'This method allows you to add a user to the specified group.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									userId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id', 'userId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												users: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/User'
													}
												},
												groups: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Group'
													}
												},
												groupMemberships: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Membership'
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/groups.remove_user': {
			post: {
				tags: ['Groups'],
				summary: 'Remove a group member',
				description: 'This method allows you to remove a user from the group.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Identifier for the collection',
										format: 'uuid'
									},
									userId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id', 'userId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'object',
											properties: {
												groups: {
													type: 'array',
													items: {
														$ref: '#/components/schemas/Group'
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/revisions.info': {
			post: {
				tags: ['Revisions'],
				summary: 'Retrieve a revision',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the revision.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Revision'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/revisions.list': {
			post: {
				tags: ['Revisions'],
				summary: 'List all revisions',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Revision'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/shares.info': {
			post: {
				tags: ['Shares'],
				summary: 'Retrieve a share object',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the share.',
										format: 'uuid'
									},
									documentId: {
										type: 'string',
										description:
											'Unique identifier for a document. One of id or documentId must be provided.',
										format: 'uuid'
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Share'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/shares.list': {
			post: {
				tags: ['Shares'],
				summary: 'List all shares',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Share'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/shares.create': {
			post: {
				tags: ['Shares'],
				summary: 'Create a share',
				description:
					'Creates a new share link that can be used by to access a document. If you request multiple shares for the same document with the same API key, the same share object will be returned. By default all shares are unpublished.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									documentId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['documentId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Share'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/shares.update': {
			post: {
				tags: ['Shares'],
				summary: 'Update a share',
				description:
					'Allows changing an existing shares published status, which removes authentication and makes it available to anyone with the link.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									},
									published: {
										type: 'boolean'
									}
								},
								required: ['id', 'published']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/Share'
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/shares.revoke': {
			post: {
				tags: ['Shares'],
				summary: 'Revoke a share',
				description:
					'Makes the share link inactive so that it can no longer be used to access the document.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'400': {
						$ref: '#/components/responses/Validation'
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.invite': {
			post: {
				tags: ['Users'],
				summary: 'Invite users',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									invites: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Invite'
										}
									}
								},
								required: ['invites']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										sent: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/Invite'
											}
										},
										users: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/User'
											}
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/users.info': {
			post: {
				tags: ['Users'],
				summary: 'Retrieve a user',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.list': {
			post: {
				tags: ['Users'],
				summary: 'List all users',
				description: 'List and filter all the users in the team',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								allOf: [
									{
										$ref: '#/components/schemas/Pagination'
									},
									{
										$ref: '#/components/schemas/Sorting'
									},
									{
										type: 'object',
										properties: {
											query: {
												type: 'string',
												example: 'jane'
											},
											filter: {
												type: 'string',
												example: 'all',
												enum: ['invited', 'viewers', 'admins', 'active', 'all', 'suspended']
											}
										}
									}
								]
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/User'
											}
										},
										pagination: {
											$ref: '#/components/schemas/Pagination'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/users.update': {
			post: {
				tags: ['Users'],
				summary: 'Update a user',
				description:
					'Update a users name or avatar. No `id` is required as it is only possible to update the current user at this time.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string'
									},
									avatarUrl: {
										type: 'string',
										format: 'uri'
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.promote': {
			post: {
				tags: ['Users'],
				summary: 'Promote a user',
				description:
					'Promote a user to be a team admin. This endpoint is only available for admin users.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.demote': {
			post: {
				tags: ['Users'],
				summary: 'Demote a user',
				description:
					'Demote a team admin to regular user permissions. This endpoint is only available for admin users.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									},
									to: {
										type: 'string',
										description: 'Which role to demote to',
										enum: ['viewer', 'member']
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.suspend': {
			post: {
				tags: ['Users'],
				summary: 'Suspend a user',
				description:
					'Suspending a user prevents the user from signing in. Users that are suspended are also not counted against billing totals in the hosted version.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.activate': {
			post: {
				tags: ['Users'],
				summary: 'Activate a user',
				description:
					'Activating a previously suspended user allows them to signin again. Users that are activated will cause billing totals to be re-calculated in the hosted version.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/User'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/users.delete': {
			post: {
				tags: ['Users'],
				summary: 'Delete a user',
				description:
					'Deleting a user removes the object entirely. In almost every circumstance it is preferable to suspend a user, as a deleted user can be recreated by signing in with SSO again.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									id: {
										type: 'string',
										description: 'Unique identifier for the user.',
										format: 'uuid'
									}
								},
								required: ['id']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: {
											type: 'boolean',
											example: true
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					},
					'404': {
						$ref: '#/components/responses/NotFound'
					}
				}
			}
		},
		'/views.list': {
			post: {
				tags: ['Views'],
				summary: 'List all views',
				description: 'List all users that have viewed a document and the overall view count.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									documentId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['documentId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											type: 'array',
											items: {
												$ref: '#/components/schemas/View'
											}
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		},
		'/views.create': {
			post: {
				tags: ['Views'],
				summary: 'Create a view',
				description:
					'Creates a new view for a document. This is documented in the interests of thoroughness however it is recommended that views are not created from outside of the Outline UI.',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									documentId: {
										type: 'string',
										format: 'uuid'
									}
								},
								required: ['documentId']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										data: {
											$ref: '#/components/schemas/View'
										}
									}
								}
							}
						}
					},
					'401': {
						$ref: '#/components/responses/Unauthenticated'
					},
					'403': {
						$ref: '#/components/responses/Unauthorized'
					}
				}
			}
		}
	},
	components: {
		schemas: {
			Permission: {
				type: 'string',
				enum: ['read', 'read_write']
			},
			Attachment: {
				type: 'object',
				properties: {
					contentType: {
						type: 'string',
						example: 'image/png'
					},
					size: {
						type: 'number'
					},
					name: {
						type: 'string'
					},
					url: {
						type: 'string',
						format: 'uri'
					},
					documentId: {
						type: 'string',
						description: 'Identifier for the associated document, if any.',
						format: 'uuid'
					}
				}
			},
			Pagination: {
				type: 'object',
				properties: {
					offset: {
						type: 'number'
					},
					limit: {
						type: 'number',
						example: 25
					}
				}
			},
			Sorting: {
				type: 'object',
				properties: {
					sort: {
						type: 'string',
						example: 'updatedAt'
					},
					direction: {
						type: 'string',
						example: 'DESC',
						enum: ['ASC', 'DESC']
					}
				}
			},
			NavigationNode: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the document.',
						format: 'uuid'
					},
					title: {
						type: 'string'
					},
					url: {
						type: 'string'
					},
					children: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/NavigationNode'
						}
					}
				}
			},
			Auth: {
				type: 'object',
				properties: {
					user: {
						$ref: '#/components/schemas/User'
					},
					team: {
						$ref: '#/components/schemas/Team'
					}
				}
			},
			Collection: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					name: {
						type: 'string',
						description: 'The name of the collection.',
						example: 'Human Resources'
					},
					description: {
						type: 'string',
						description: 'A description of the collection, may contain markdown formatting',
						example: ''
					},
					sort: {
						type: 'object',
						description:
							'The sort of documents in the collection. Note that not all API responses respect this and it is left as a frontend concern to implement.',
						properties: {
							field: {
								type: 'string'
							},
							direction: {
								type: 'string',
								enum: ['asc', 'desc']
							}
						}
					},
					index: {
						type: 'string',
						description: 'The position of the collection in the sidebar',
						example: 'P'
					},
					color: {
						type: 'string',
						description:
							'A color representing the collection, this is used to help make collections more identifiable in the UI. It should be in HEX format including the #',
						example: '#123123'
					},
					icon: {
						type: 'string',
						description: 'A string that represents an icon in the outline-icons package'
					},
					permission: {
						$ref: '#/components/schemas/Permission'
					},
					createdAt: {
						type: 'string',
						description: 'The date and time that this object was created',
						readOnly: true,
						format: 'date-time'
					},
					updatedAt: {
						type: 'string',
						description: 'The date and time that this object was last changed',
						readOnly: true,
						format: 'date-time'
					},
					deletedAt: {
						type: 'string',
						nullable: true,
						description: 'The date and time that this object was deleted',
						readOnly: true,
						format: 'date-time'
					}
				}
			},
			Document: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					collectionId: {
						type: 'string',
						description: 'Identifier for the associated collection.',
						format: 'uuid'
					},
					parentDocumentId: {
						type: 'string',
						description: 'Identifier for the document this is a child of, if any.',
						format: 'uuid'
					},
					title: {
						type: 'string',
						description: 'The title of the document.',
						example: '🎉 Welcome to Acme Inc'
					},
					fullWidth: {
						type: 'boolean',
						description: 'Whether this document should be displayed in a full-width view.'
					},
					emoji: {
						type: 'string',
						description: 'An emoji associated with the document.',
						example: '🎉',
						readOnly: true
					},
					text: {
						type: 'string',
						description: 'The text content of the document, contains markdown formatting',
						example: '…'
					},
					urlId: {
						type: 'string',
						description:
							'A short unique ID that can be used to identify the document as an alternative to the UUID',
						example: 'hDYep1TPAM'
					},
					collaborators: {
						type: 'array',
						items: {
							$ref: '#/components/schemas/User'
						}
					},
					pinned: {
						type: 'boolean',
						description: 'Whether this document is pinned in the collection'
					},
					template: {
						type: 'boolean',
						description: 'Whether this document is a template'
					},
					templateId: {
						type: 'string',
						description:
							'Unique identifier for the template this document was created from, if any',
						format: 'uuid'
					},
					revision: {
						type: 'number',
						description:
							'A number that is auto incrementing with every revision of the document that is saved',
						readOnly: true
					},
					createdAt: {
						type: 'string',
						description: 'The date and time that this object was created',
						readOnly: true,
						format: 'date-time'
					},
					createdBy: {
						$ref: '#/components/schemas/User'
					},
					updatedAt: {
						type: 'string',
						description: 'The date and time that this object was last changed',
						readOnly: true,
						format: 'date-time'
					},
					updatedBy: {
						$ref: '#/components/schemas/User'
					},
					publishedAt: {
						type: 'string',
						nullable: true,
						description: 'The date and time that this object was published',
						readOnly: true,
						format: 'date-time'
					},
					archivedAt: {
						type: 'string',
						description: 'The date and time that this object was archived',
						readOnly: true,
						format: 'date-time'
					},
					deletedAt: {
						type: 'string',
						nullable: true,
						description: 'The date and time that this object was deleted',
						readOnly: true,
						format: 'date-time'
					}
				}
			},
			Event: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					name: {
						type: 'string',
						example: 'documents.create',
						readOnly: true
					},
					modelId: {
						type: 'string',
						description:
							'Identifier for the object this event is associated with when it is not one of document, collection, or user.',
						format: 'uuid',
						readOnly: true
					},
					actorId: {
						type: 'string',
						description: 'The user that performed the action.',
						format: 'uuid',
						readOnly: true
					},
					actorIpAddress: {
						type: 'string',
						description:
							'The ip address the action was performed from. This field is only returned when the `auditLog` boolean is true.',
						example: '60.169.88.100',
						readOnly: true
					},
					collectionId: {
						type: 'string',
						format: 'uuid',
						description: 'Identifier for the associated collection, if any',
						readOnly: true
					},
					documentId: {
						type: 'string',
						format: 'uuid',
						description: 'Identifier for the associated document, if any',
						readOnly: true
					},
					createdAt: {
						type: 'string',
						description: 'The date and time that this event was created',
						readOnly: true,
						format: 'date-time'
					},
					data: {
						type: 'object',
						example: {
							name: 'Equipment list'
						},
						description: 'Additional unstructured data associated with the event',
						readOnly: true
					},
					actor: {
						$ref: '#/components/schemas/User'
					}
				}
			},
			Error: {
				type: 'object',
				properties: {
					ok: {
						type: 'boolean',
						example: false
					},
					error: {
						type: 'string'
					}
				}
			},
			FileOperation: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					type: {
						type: 'string',
						example: 'export',
						description: 'The type of file operation.',
						readOnly: true,
						enum: ['import', 'export']
					},
					state: {
						type: 'string',
						description: 'The state of the file operation.',
						example: 'complete',
						readOnly: true,
						enum: ['creating', 'uploading', 'complete', 'error', 'expired']
					},
					collection: {
						allOf: [
							{
								nullable: true
							},
							{
								$ref: '#/components/schemas/Collection'
							}
						]
					},
					user: {
						$ref: '#/components/schemas/User'
					},
					size: {
						type: 'number',
						description: 'The size of the resulting file in bytes',
						readOnly: true,
						example: 2048
					},
					createdAt: {
						type: 'string',
						description: 'The date and time that this object was created',
						readOnly: true,
						format: 'date-time'
					}
				}
			},
			Group: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					name: {
						type: 'string',
						description: 'The name of this group.',
						example: 'Engineering'
					},
					memberCount: {
						type: 'number',
						description: 'The number of users that are members of the group',
						example: 11,
						readOnly: true
					},
					createdAt: {
						type: 'string',
						description: 'The date and time that this object was created',
						readOnly: true,
						format: 'date-time'
					},
					updatedAt: {
						type: 'string',
						description: 'The date and time that this object was last changed',
						readOnly: true,
						format: 'date-time'
					}
				}
			},
			Share: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					documentTitle: {
						type: 'string',
						description: 'Title of the shared document.',
						example: 'React best practices',
						readOnly: true
					},
					documentUrl: {
						type: 'string',
						format: 'uri',
						description: 'URL of the original document.',
						readOnly: true
					},
					url: {
						type: 'string',
						format: 'uri',
						description: 'URL of the publicly shared document.',
						readOnly: true
					},
					published: {
						type: 'boolean',
						example: false,
						description: 'If true the share can be loaded without a user account.'
					},
					includeChildDocuments: {
						type: 'boolean',
						example: true,
						description: 'If to also give permission to view documents nested beneath this one.'
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'Date and time when this share was created',
						readOnly: true
					},
					createdBy: {
						$ref: '#/components/schemas/User'
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
						description: 'Date and time when this share was edited',
						readOnly: true
					},
					lastAccessedAt: {
						type: 'string',
						format: 'date-time',
						description: 'Date and time when this share was last viewed',
						readOnly: true
					}
				}
			},
			Revision: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					documentId: {
						type: 'string',
						description: 'Identifier for the associated document.',
						readOnly: true,
						format: 'uuid'
					},
					title: {
						type: 'string',
						description: 'Title of the document.',
						readOnly: true
					},
					text: {
						type: 'string',
						description: 'Body of the document, may contain markdown formatting',
						readOnly: true
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
						description: 'Date and time when this revision was created',
						readOnly: true
					},
					createdBy: {
						$ref: '#/components/schemas/User'
					}
				}
			},
			Team: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					name: {
						type: 'string',
						description:
							'The name of this team, it is usually auto-generated when the first SSO connection is made but can be changed if neccessary.'
					},
					avatarUrl: {
						type: 'string',
						format: 'uri',
						description:
							'The URL for the image associated with this team, it will be displayed in the team switcher and in the top left of the knowledge base along with the name.'
					},
					sharing: {
						type: 'boolean',
						description:
							'Whether this team has share links globally enabled. If this value is false then all sharing UI and APIs are disabled.'
					},
					defaultCollectionId: {
						type: 'string',
						description:
							'If set then the referenced collection is where users will be redirected to after signing in instead of the Home screen',
						format: 'uuid'
					},
					defaultUserRole: {
						type: 'string',
						description:
							'If set then this role will be used as the default for users that signup via SSO',
						enum: ['viewer', 'member', 'admin']
					},
					memberCollectionCreate: {
						type: 'boolean',
						description:
							'Whether members are allowed to create new collections. If false then only admins can create collections.'
					},
					documentEmbeds: {
						type: 'boolean',
						description:
							'Whether this team has embeds in documents globally enabled. It can be disabled to reduce potential data leakage to third parties.'
					},
					collaborativeEditing: {
						type: 'boolean',
						description:
							'Whether this team has collaborative editing in documents globally enabled.'
					},
					inviteRequired: {
						type: 'boolean',
						description:
							'Whether an invite is required to join this team, if false users may join with a linked SSO provider.'
					},
					allowedDomains: {
						type: 'array',
						items: {
							type: 'string',
							description: 'A hostname that user emails are restricted to'
						}
					},
					guestSignin: {
						type: 'boolean',
						description:
							'Whether this team has guest signin enabled. Guests can signin with an email address and are not required to have a Google Workspace/Slack SSO account once invited.'
					},
					subdomain: {
						type: 'string',
						description:
							"Represents the subdomain at which this team's knowledge base can be accessed."
					},
					url: {
						type: 'string',
						description:
							"The fully qualified URL at which this team's knowledge base can be accessed.",
						readOnly: true,
						format: 'uri'
					}
				}
			},
			User: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true,
						format: 'uuid'
					},
					name: {
						type: 'string',
						description:
							'The name of this user, it is migrated from Slack or Google Workspace when the SSO connection is made but can be changed if neccessary.',
						example: 'Jane Doe'
					},
					avatarUrl: {
						type: 'string',
						format: 'uri',
						description:
							'The URL for the image associated with this user, it will be displayed in the application UI and email notifications.'
					},
					email: {
						type: 'string',
						description:
							'The email associated with this user, it is migrated from Slack or Google Workspace when the SSO connection is made but can be changed if neccessary.',
						format: 'email',
						readOnly: true
					},
					isAdmin: {
						type: 'boolean',
						description: 'Whether this user has admin permissions.',
						readOnly: true
					},
					isSuspended: {
						type: 'boolean',
						description: 'Whether this user has been suspended.',
						readOnly: true
					},
					lastActiveAt: {
						type: 'string',
						description:
							'The last time this user made an API request, this value is updated at most every 5 minutes.',
						readOnly: true,
						format: 'date'
					},
					createdAt: {
						type: 'string',
						description:
							'The date and time that this user first signed in or was invited as a guest.',
						readOnly: true,
						format: 'date-time'
					}
				}
			},
			Invite: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						description: 'The full name of the user being invited'
					},
					email: {
						type: 'string',
						description: 'The email address to invite'
					},
					role: {
						type: 'string',
						enum: ['member', 'guest', 'admin']
					}
				}
			},
			Membership: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true
					},
					userId: {
						type: 'string',
						description: 'Identifier for the associated user.',
						readOnly: true,
						format: 'uuid'
					},
					collectionId: {
						type: 'string',
						description: 'Identifier for the associated collection.',
						readOnly: true,
						format: 'uuid'
					},
					permission: {
						$ref: '#/components/schemas/Permission'
					}
				}
			},
			Policy: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object this policy references.',
						format: 'uuid',
						readOnly: true
					},
					abilities: {
						type: 'object',
						properties: {
							create: {
								type: 'boolean'
							},
							read: {
								type: 'boolean'
							},
							update: {
								type: 'boolean'
							},
							delete: {
								type: 'boolean'
							},
							restore: {
								type: 'boolean'
							},
							star: {
								type: 'boolean'
							},
							unstar: {
								type: 'boolean'
							},
							share: {
								type: 'boolean'
							},
							download: {
								type: 'boolean'
							},
							pin: {
								type: 'boolean'
							},
							unpin: {
								type: 'boolean'
							},
							move: {
								type: 'boolean'
							},
							archive: {
								type: 'boolean'
							},
							unarchive: {
								type: 'boolean'
							},
							createChildDocument: {
								type: 'boolean'
							}
						}
					}
				}
			},
			GroupMembership: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true
					},
					groupId: {
						type: 'string',
						description: 'Identifier for the associated group.',
						readOnly: true,
						format: 'uuid'
					},
					userId: {
						type: 'string',
						description: 'Identifier for the associated user.',
						readOnly: true,
						format: 'uuid'
					},
					user: {
						$ref: '#/components/schemas/User'
					}
				}
			},
			CollectionGroupMembership: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true
					},
					groupId: {
						type: 'string',
						description: 'Identifier for the associated group.',
						readOnly: true,
						format: 'uuid'
					},
					collectionId: {
						type: 'string',
						description: 'Identifier for the associated collection.',
						readOnly: true,
						format: 'uuid'
					},
					permission: {
						$ref: '#/components/schemas/Permission'
					}
				}
			},
			View: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the object.',
						readOnly: true
					},
					documentId: {
						type: 'string',
						description: 'Identifier for the associated document.',
						readOnly: true,
						format: 'uuid'
					},
					firstViewedAt: {
						type: 'string',
						description: 'When the document was first viewed by the user',
						readOnly: true,
						format: 'date-time'
					},
					lastViewedAt: {
						type: 'string',
						description: 'When the document was last viewed by the user',
						readOnly: true,
						format: 'date-time'
					},
					count: {
						type: 'number',
						description: 'The number of times the user has viewed the document.',
						example: 22,
						readOnly: true
					},
					user: {
						$ref: '#/components/schemas/User'
					}
				}
			}
		},
		responses: {
			NotFound: {
				description: 'The specified resource was not found.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Error'
						}
					}
				}
			},
			Validation: {
				description: 'The request failed one or more validations.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Error'
						}
					}
				}
			},
			Unauthorized: {
				description: 'The current API key is not authorized to perform this action.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Error'
						}
					}
				}
			},
			Unauthenticated: {
				description: 'The API key is missing or otherwise invalid.',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Error'
						}
					}
				}
			}
		},
		securitySchemes: {
			http: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	}
} as const;
