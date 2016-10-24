/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { TPromise } from 'vs/base/common/winjs.base';
import { IInstantiationService, createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { InternalTreeExplorerNode, InternalTreeExplorerNodeProvider } from 'vs/workbench/parts/explorers/common/treeExplorerViewModel';
import { IMessageService, Severity } from 'vs/platform/message/common/message';
import Event, { Emitter } from 'vs/base/common/event';

export const ITreeExplorerViewletService = createDecorator<ITreeExplorerViewletService>('customViewletService');

export interface ITreeExplorerViewletService {
	_serviceBrand: any;

	onTreeExplorerNodeProviderRegistered: Event<String>;

	registerTreeExplorerNodeProvider(providerId: string, provider: InternalTreeExplorerNodeProvider): void;
	hasProvider(providerId: string): boolean;

	provideRootNode(providerId: string): TPromise<InternalTreeExplorerNode>;
	resolveChildren(providerId: string, node: InternalTreeExplorerNode): TPromise<InternalTreeExplorerNode[]>;
	executeCommand(providerId: string, node: InternalTreeExplorerNode): TPromise<void>;
}

export class TreeExplorerViewletService implements ITreeExplorerViewletService {
	public _serviceBrand: any;

	private _onTreeExplorerNodeProviderRegistered = new Emitter<String>();
	public get onTreeExplorerNodeProviderRegistered(): Event<string> { return this._onTreeExplorerNodeProviderRegistered.event; };

	private _treeExplorerNodeProviders: { [providerId: string]: InternalTreeExplorerNodeProvider };

	constructor(
		@IInstantiationService private _instantiationService: IInstantiationService,
		@IMessageService private messageService: IMessageService,
	) {
		this._treeExplorerNodeProviders = Object.create(null);
	}

	public registerTreeExplorerNodeProvider(providerId: string, provider: InternalTreeExplorerNodeProvider): void {
		this._treeExplorerNodeProviders[providerId] = provider;
		this._onTreeExplorerNodeProviderRegistered.fire(providerId);
	}

	public hasProvider(providerId: string): boolean {
		return !!this._treeExplorerNodeProviders[providerId];
	}

	public provideRootNode(providerId: string): TPromise<InternalTreeExplorerNode> {
		const provider = this.getProvider(providerId);
		return TPromise.wrap(provider.provideRootNode());
	}

	public resolveChildren(providerId: string, node: InternalTreeExplorerNode): TPromise<InternalTreeExplorerNode[]> {
		const provider = this.getProvider(providerId);
		return TPromise.wrap(provider.resolveChildren(node));
	}

	public executeCommand(providerId: string, node: InternalTreeExplorerNode): TPromise<void> {
		const provider = this.getProvider(providerId);
		return TPromise.wrap(provider.executeCommand(node));
	}

	private getProvider(providerId: string): InternalTreeExplorerNodeProvider {
		const provider = this._treeExplorerNodeProviders[providerId];

		if (!provider) {
			this.messageService.show(Severity.Error, `No TreeExplorerNodeProvider with id '${providerId}' registered.`);
		}

		return provider;
	}
}
