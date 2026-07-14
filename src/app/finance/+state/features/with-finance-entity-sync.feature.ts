import { effect, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withHooks } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import {
  AccountDto,
  CategoryDto,
  CategoryGroupDto,
  PaymentPartnerDto,
  TransactionListResponse,
} from '../models';
import { accountEntities } from '../configs/account.config';
import { categoryEntities } from '../configs/category.config';
import { categoryGroupEntities } from '../configs/category-group.config';
import { paymentPartnerEntities } from '../configs/payment-partner.config';
import { transactionEntities } from '../configs/transaction.config';

export function withFinanceEntitySync() {
  return signalStoreFeature(
    {
      props: type<{
        accountsResource: ResourceRef<AccountDto[]>;
        categoriesResource: ResourceRef<CategoryDto[]>;
        categoryGroupsResource: ResourceRef<CategoryGroupDto[]>;
        paymentPartnersResource: ResourceRef<PaymentPartnerDto[]>;
        transactionsResource: ResourceRef<TransactionListResponse>;
      }>(),
    },
    withHooks({
      onInit(store) {
        effect(() => {
          const resource = store.accountsResource;

          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), accountEntities));
          }
        });

        effect(() => {
          const resource = store.categoriesResource;

          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), categoryEntities));
          }
        });

        effect(() => {
          const resource = store.categoryGroupsResource;

          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), categoryGroupEntities));
          }
        });

        effect(() => {
          const resource = store.paymentPartnersResource;

          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value(), paymentPartnerEntities));
          }
        });

        effect(() => {
          const resource = store.transactionsResource;

          if (resource.hasValue()) {
            patchState(store, setAllEntities(resource.value().transactions, transactionEntities));
          }
        });
      },
    })
  );
}
