import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/store/context';

import Transaction from 'components/Transaction/Transaction';

import { useCheckLogin } from 'src/hooks/useCheckLogin';
import { useTransaction } from 'hooks/useTransaction';
import { loadTokens } from 'src/utils';

export const Deposit: React.FC = observer(
  (): JSX.Element => {
    const {
      addressValue,
      amountValue,
      deposit,
      hash,
      isExecuted,
      setAddressValue,
      setAmountValue,
      setHash,
      setExecuted,
      setSymbol,
    } = useTransaction();

    const store = useStore();

    const { ethBalances, price } = store;

    useCheckLogin();

    return (
      <Transaction
        addressValue={addressValue}
        amountValue={amountValue}
        balances={ethBalances}
        hash={hash}
        isExecuted={isExecuted}
        isInput={false}
        onChangeAddress={(e: string) => setAddressValue(e)}
        onChangeAmount={setAmountValue}
        price={price}
        setHash={setHash}
        setExecuted={setExecuted}
        setSymbol={setSymbol}
        setTransactionType={t => {
          store.transactionType = t;
        }}
        title='Deposit'
        transactionAction={deposit}
      />
    );
  },
);
