import { useReadContract, useAccount, useWatchContractEvent } from 'wagmi';
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from '@/config/contract';
import { useQueryClient } from '@tanstack/react-query';

export function useMarketData() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Watch for SharesPurchased events
  useWatchContractEvent({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'SharesPurchased',
    onLogs() {
      // Invalidate all queries to refetch fresh data
      queryClient.invalidateQueries();
    },
  });

  // Watch for SharesSold events
  useWatchContractEvent({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'SharesSold',
    onLogs() {
      queryClient.invalidateQueries();
    },
  });

  // Watch for MarketResolved events
  useWatchContractEvent({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketResolved',
    onLogs() {
      queryClient.invalidateQueries();
    },
  });

  // Read market question
  const { data: question } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'question',
  });

  // Read end time
  const { data: endTime } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'endTime',
  });

  // Read if resolved
  const { data: resolved } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'resolved',
  });

  // Read outcome (if resolved)
  const { data: outcome } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'outcome',
  });

  // Read YES probability
  const { data: yesProbability } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getYesProbability',
  });

  // Read pool sizes
  const { data: yesPool } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'yesPool',
  });

  const { data: noPool } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'noPool',
  });

  // Read user position
  const { data: userPosition } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getUserPosition',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    question,
    endTime: endTime ? Number(endTime) : 0,
    resolved: !!resolved,
    outcome: !!outcome,
    yesProbability: yesProbability ? Number(yesProbability) : 5000,
    yesPool: yesPool ? yesPool : 0n,
    noPool: noPool ? noPool : 0n,
    userPosition: userPosition ? {
      yesShares: userPosition[0],
      noShares: userPosition[1],
      yesValue: userPosition[2],
      noValue: userPosition[3],
    } : null,
  };
}
