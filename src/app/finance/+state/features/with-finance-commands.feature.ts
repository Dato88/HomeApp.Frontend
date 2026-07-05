import { ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { concatMap, exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import {
  AccountDto,
  CategoryDto,
  CreateAccountRequest,
  CreateCategoryRequest,
  CreateTransactionRequest,
  ImportTransactionsRequest,
  ImportTransactionsResponse,
  SetTransactionCategoryRequest,
  ShareAccountRequest,
  TransactionListResponse,
  UpdateAccountRequest,
  UpdateCategoryRequest,
  UpdateTransactionRequest,
} from '../models';

export interface FinanceCommandState {
  isSaving: boolean;
  error: string | null;
  lastImportResult: ImportTransactionsResponse | null;
}

export function withFinanceCommands() {
  return signalStoreFeature(
    {
      props: type<{
        _accountService: AccountService;
        _categoryService: CategoryService;
        _transactionService: TransactionService;
        accountsResource: ResourceRef<AccountDto[]>;
        categoriesResource: ResourceRef<CategoryDto[]>;
        transactionsResource: ResourceRef<TransactionListResponse>;
      }>(),
      methods: type<{ _handleError: (error: unknown) => void }>(),
      state: type<FinanceCommandState>(),
    },
    withMethods((store) => {
      const handleIdResult = (result: Result<number>, fallbackMessage: string): void => {
        if (result.isSuccess) {
          return;
        }

        patchState(store, { error: result.message ?? fallbackMessage });
      };

      const reloadAccounts = (): void => {
        store.accountsResource.reload();
      };

      const reloadCategories = (): void => {
        store.categoriesResource.reload();
      };

      const reloadTransactions = (): void => {
        store.transactionsResource.reload();
      };

      const command = <TRequest>(
        execute: (request: TRequest) => ReturnType<AccountService['createAccount']>,
        fallbackMessage: string,
        onSuccess: () => void
      ) =>
        rxMethod<TRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap((request) =>
              execute(request).pipe(
                tapResponse({
                  next: (result) => {
                    handleIdResult(result, fallbackMessage);

                    if (result.isSuccess) {
                      onSuccess();
                    }
                  },
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
        );

      return {
        createAccount: command<CreateAccountRequest>(
          (request) => store._accountService.createAccount(request),
          'Failed to create account',
          reloadAccounts
        ),
        updateAccount: command<UpdateAccountRequest>(
          (request) => store._accountService.updateAccount(request),
          'Failed to update account',
          reloadAccounts
        ),
        deleteAccount: command<number>(
          (accountId) => store._accountService.deleteAccount(accountId),
          'Failed to delete account',
          reloadAccounts
        ),
        shareAccount: command<ShareAccountRequest>(
          (request) => store._accountService.shareAccount(request),
          'Failed to share account',
          reloadAccounts
        ),
        unshareAccount: command<ShareAccountRequest>(
          (request) => store._accountService.unshareAccount(request),
          'Failed to unshare account',
          reloadAccounts
        ),
        createCategory: command<CreateCategoryRequest>(
          (request) => store._categoryService.createCategory(request),
          'Failed to create category',
          reloadCategories
        ),
        updateCategory: command<UpdateCategoryRequest>(
          (request) => store._categoryService.updateCategory(request),
          'Failed to update category',
          reloadCategories
        ),
        deleteCategory: command<number>(
          (categoryId) => store._categoryService.deleteCategory(categoryId),
          'Failed to delete category',
          reloadCategories
        ),
        createTransaction: command<CreateTransactionRequest>(
          (request) => store._transactionService.createTransaction(request),
          'Failed to create transaction',
          reloadTransactions
        ),
        updateTransaction: command<UpdateTransactionRequest>(
          (request) => store._transactionService.updateTransaction(request),
          'Failed to update transaction',
          reloadTransactions
        ),
        deleteTransaction: command<number>(
          (transactionId) => store._transactionService.deleteTransaction(transactionId),
          'Failed to delete transaction',
          reloadTransactions
        ),
        setTransactionCategory: command<SetTransactionCategoryRequest>(
          (request) => store._transactionService.setCategory(request),
          'Failed to set transaction category',
          reloadTransactions
        ),
        importTransactions: rxMethod<ImportTransactionsRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null, lastImportResult: null })),
            concatMap((request) =>
              store._transactionService.importTransactions(request).pipe(
                tapResponse({
                  next: (result) => {
                    if (result.isSuccess) {
                      patchState(store, { lastImportResult: result.value });
                      reloadTransactions();
                    } else {
                      patchState(store, { error: result.message ?? 'Import failed' });
                    }
                  },
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
        ),
      };
    })
  );
}
