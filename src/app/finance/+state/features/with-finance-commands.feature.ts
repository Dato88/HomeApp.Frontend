import { inject, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { NamedEntityState, updateEntities } from '@ngrx/signals/entities';
import { concatMap, exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { AccountService } from '../../services/account.service';
import { CategoryGroupService } from '../../services/category-group.service';
import { CategoryService } from '../../services/category.service';
import { PaymentPartnerService } from '../../services/payment-partner.service';
import { TransactionService } from '../../services/transaction.service';
import { transactionEntities } from '../configs/transaction.config';
import {
  AccountDto,
  CategoryDto,
  CategoryGroupDto,
  CreateAccountRequest,
  CreateCategoryGroupRequest,
  CreateCategoryRequest,
  CreateTransactionRequest,
  ImportTransactionsRequest,
  ImportTransactionsResponse,
  MergePaymentPartnersRequest,
  PaymentPartnerDto,
  RenamePaymentPartnerRequest,
  SetTransactionCategoryRequest,
  ShareAccountRequest,
  TransactionDto,
  TransactionFilter,
  TransactionListResponse,
  UpdateAccountRequest,
  UpdateCategoryGroupRequest,
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
        _categoryGroupService: CategoryGroupService;
        _paymentPartnerService: PaymentPartnerService;
        _transactionService: TransactionService;
        accountsResource: ResourceRef<AccountDto[]>;
        categoriesResource: ResourceRef<CategoryDto[]>;
        categoryGroupsResource: ResourceRef<CategoryGroupDto[]>;
        paymentPartnersResource: ResourceRef<PaymentPartnerDto[]>;
        transactionsResource: ResourceRef<TransactionListResponse>;
      }>(),
      methods: type<{ _handleError: (error: unknown) => void }>(),
      state: type<
        FinanceCommandState & {
          transactionFilter: TransactionFilter | undefined;
        } & NamedEntityState<TransactionDto, 'transaction'>
      >(),
    },
    withMethods((store, toast = inject(ToastService)) => {
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

      const reloadCategoryGroups = (): void => {
        store.categoryGroupsResource.reload();
      };

      const reloadPaymentPartners = (): void => {
        store.paymentPartnersResource.reload();
      };

      const reloadTransactions = (): void => {
        store.transactionsResource.reload();
      };

      const command = <TRequest>(
        execute: (request: TRequest) => ReturnType<AccountService['createAccount']>,
        fallbackMessage: string,
        onSuccess: () => void,
        successMessage?: string
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

                      if (successMessage) {
                        toast.success(successMessage);
                      }
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
          'Konto konnte nicht angelegt werden',
          reloadAccounts,
          'Konto angelegt'
        ),
        updateAccount: command<UpdateAccountRequest>(
          (request) => store._accountService.updateAccount(request),
          'Konto konnte nicht aktualisiert werden',
          reloadAccounts,
          'Konto gespeichert'
        ),
        deleteAccount: command<number>(
          (accountId) => store._accountService.deleteAccount(accountId),
          'Konto konnte nicht gelöscht werden',
          reloadAccounts,
          'Konto gelöscht'
        ),
        shareAccount: command<ShareAccountRequest>(
          (request) => store._accountService.shareAccount(request),
          'Konto konnte nicht geteilt werden',
          reloadAccounts,
          'Konto geteilt'
        ),
        unshareAccount: command<ShareAccountRequest>(
          (request) => store._accountService.unshareAccount(request),
          'Freigabe konnte nicht entfernt werden',
          reloadAccounts,
          'Freigabe entfernt'
        ),
        createCategory: command<CreateCategoryRequest>(
          (request) => store._categoryService.createCategory(request),
          'Kategorie konnte nicht angelegt werden',
          reloadCategories,
          'Kategorie angelegt'
        ),
        updateCategory: command<UpdateCategoryRequest>(
          (request) => store._categoryService.updateCategory(request),
          'Kategorie konnte nicht aktualisiert werden',
          reloadCategories,
          'Kategorie gespeichert'
        ),
        deleteCategory: command<number>(
          (categoryId) => store._categoryService.deleteCategory(categoryId),
          'Kategorie konnte nicht gelöscht werden',
          reloadCategories,
          'Kategorie gelöscht'
        ),
        createCategoryGroup: command<CreateCategoryGroupRequest>(
          (request) => store._categoryGroupService.createCategoryGroup(request),
          'Gruppe konnte nicht angelegt werden',
          reloadCategoryGroups,
          'Gruppe angelegt'
        ),
        updateCategoryGroup: command<UpdateCategoryGroupRequest>(
          (request) => store._categoryGroupService.updateCategoryGroup(request),
          'Gruppe konnte nicht aktualisiert werden',
          reloadCategoryGroups,
          'Gruppe gespeichert'
        ),
        // Kategorien mitladen: das Backend hängt Kategorien der gelöschten Gruppe aus.
        deleteCategoryGroup: command<number>(
          (categoryGroupId) => store._categoryGroupService.deleteCategoryGroup(categoryGroupId),
          'Gruppe konnte nicht gelöscht werden',
          () => {
            reloadCategoryGroups();
            reloadCategories();
          },
          'Gruppe gelöscht'
        ),
        createTransaction: command<CreateTransactionRequest>(
          (request) => store._transactionService.createTransaction(request),
          'Buchung konnte nicht angelegt werden',
          reloadTransactions,
          'Buchung angelegt'
        ),
        updateTransaction: command<UpdateTransactionRequest>(
          (request) => store._transactionService.updateTransaction(request),
          'Buchung konnte nicht aktualisiert werden',
          reloadTransactions,
          'Buchung gespeichert'
        ),
        deleteTransaction: command<number>(
          (transactionId) => store._transactionService.deleteTransaction(transactionId),
          'Buchung konnte nicht gelöscht werden',
          reloadTransactions,
          'Buchung gelöscht'
        ),
        renamePaymentPartner: command<RenamePaymentPartnerRequest>(
          (request) => store._paymentPartnerService.renamePaymentPartner(request),
          'Zahlungspartner konnte nicht umbenannt werden',
          reloadPaymentPartners,
          'Zahlungspartner umbenannt'
        ),
        // Verschobene Buchungen tragen danach eine neue paymentPartnerId - ein aktiver
        // Zahlungspartner-Filter im Buchungen-Tab auf den gelöschten Source liefe sonst leer.
        mergePaymentPartners: command<MergePaymentPartnersRequest>(
          (request) => store._paymentPartnerService.mergePaymentPartners(request),
          'Zahlungspartner konnten nicht zusammengeführt werden',
          () => {
            reloadPaymentPartners();
            reloadTransactions();
          },
          'Zahlungspartner zusammengeführt'
        ),
        // Patcht nur den betroffenen Datensatz statt die ganze Liste neu zu laden -
        // ein voller reload() würde das Grid kurz durch ein Skeleton ersetzen und
        // die Scroll-Position der Nutzerin zurücksetzen.
        setTransactionCategory: rxMethod<SetTransactionCategoryRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap((request) =>
              store._transactionService.setCategory(request).pipe(
                tapResponse({
                  next: (result) => {
                    handleIdResult(result, 'Kategorie konnte nicht zugewiesen werden');

                    if (!result.isSuccess) {
                      return;
                    }

                    // Verlässt der Datensatz durch die Zuweisung den aktiven
                    // "Nur ohne Kategorie"-Filter, muss die Liste neu geladen werden,
                    // damit er dort korrekt verschwindet.
                    if (store.transactionFilter()?.uncategorized && request.categoryId != null) {
                      reloadTransactions();
                      return;
                    }

                    patchState(
                      store,
                      updateEntities(
                        {
                          ids: request.transactionIds,
                          changes: { categoryId: request.categoryId },
                        },
                        transactionEntities
                      )
                    );
                  },
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
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
                      toast.success(`Import abgeschlossen: ${result.value.imported} übernommen`);
                    } else {
                      patchState(store, { error: result.message ?? 'Import fehlgeschlagen' });
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
