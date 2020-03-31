import React, { useCallback, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { useRootData } from 'hooks/useRootData';

import DataList from 'components/DataList/DataList';

import { ZK_EXPLORER } from 'constants/links';
import { useTimeout } from 'hooks/timers';
import { Transition } from 'components/Transition/Transition';

const Transactions: React.FC = (): JSX.Element => {
  const dataPropertyName = 'to';

  const {
    ethId,
    provider,
    searchTransactions,
    setTransactions,
    zkWallet,
  } = useRootData(
    ({ ethId, provider, searchTransactions, setTransactions, zkWallet }) => ({
      ethId: ethId.get(),
      provider: provider.get(),
      searchTransactions: searchTransactions.get(),
      setTransactions,
      zkWallet: zkWallet.get(),
    }),
  );

  const history = useHistory();

  const arrTransactions: any = localStorage.getItem(
    `history${zkWallet?.address()}`,
  );
  const transactions = JSON.parse(arrTransactions);

  const [isCopyModal, openCopyModal] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const inputRef: (HTMLInputElement | null)[] = [];

  const handleCopy = useCallback(
    address => {
      inputRef.map(el => {
        if (address === el?.value) {
          el?.focus();
          el?.select();
          document.execCommand('copy');
        }
      });
      openCopyModal(true);
    },
    [inputRef],
  );

  useTimeout(() => isCopyModal && openCopyModal(false), 2000);

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
    }
    setItems([...items, transactions.slice(items.length, items.length + 10)]);
  };

  useEffect(() => {
    if (!ethId) {
      window.location.pathname = '/';
      history.push('/');
    }
  }, [ethId, history]);

  return (
    <DataList
      setValue={setTransactions}
      dataProperty={dataPropertyName}
      data={transactions}
      title='Transactions'
      visible={true}
    >
      {transactions ? (
        searchTransactions?.map(({ amount, type, hash, to, token }) => (
          <div className='transaction-history-wrapper' key={hash}>
            <div className='transaction-history-left'>
              <div className={`transaction-history ${type}`}></div>
              <div className='transaction-history-amount'>
                {+amount.toFixed(3)}
              </div>
              <div className='transaction-history-hash'>
                {token && token.length > 10 ? (
                  token.replace(token.slice(6, token.length - 3), '...')
                ) : (
                  <>zk{token}</>
                )}
              </div>
            </div>
            <input
              onChange={undefined}
              className='copy-block-input'
              value={to.toString()}
              ref={e => inputRef.push(e)}
            />
            <div className='transaction-history-right'>
              <Transition trigger={isCopyModal} timeout={200} type='fly'>
                <div className={'hint-copied open'}>
                  <p>Copied!</p>
                </div>
              </Transition>
              <div className='transaction-history-address'>
                {type === 'transfer' && (
                  <>
                    <span>Sent to:</span>
                    <p>{to?.replace(to?.slice(6, to?.length - 3), '...')}</p>
                  </>
                )}
                {type === 'deposit' && (
                  <>
                    <span>Deposited to:</span>
                    <p>Your account</p>
                  </>
                )}
                {type === 'withdraw' && (
                  <>
                    <span>Withdrawed to:</span>
                    <p>{to?.replace(to?.slice(6, to?.length - 3), '...')}</p>
                  </>
                )}
              </div>
              <div className='contact-edit-wrapper'>
                <input type='radio' className='balances-contact-edit' />
                <div className='contact-manage'>
                  <div>
                    <a target='_blank' href={`${ZK_EXPLORER}/${hash}`}>
                      View info on explorer
                    </a>
                  </div>
                  <div>
                    <button
                      className='contact-manage-copy btn-tr'
                      onClick={() => handleCopy(to)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='default-text'>History is empty</div>
      )}
    </DataList>
  );
};

export default Transactions;
