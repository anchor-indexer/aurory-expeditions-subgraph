import { BigInt, log, store } from '@anchor-indexer/ts';
import {
  AddAuryWinnerCall,
  AddRewardCall,
  ClaimAuryRewardCall,
  ClaimCall,
  LockStakeCall,
  StakeCall,
  UnstakeCall,
  AddWinnerCall,
  RemoveRewardCall,
  CloseUserStakingCall,
} from '../generated/AOE/AOE';
import {
  AvailableRewardMint,
  Squad,
  SquadMint,
  User,
  SquadReward,
} from '../generated/schema';

export {
  AddAuryWinnerCall,
  AddRewardCall,
  ClaimAuryRewardCall,
  ClaimCall,
  LockStakeCall,
  StakeCall,
  UnstakeCall,
  AddWinnerCall,
  RemoveRewardCall,
  CloseUserStakingCall,
} from '../generated/AOE/AOE';
export {
  AvailableRewardMint,
  Squad,
  SquadMint,
  User,
  SquadReward,
} from '../generated/schema';

export function handleStake(call: StakeCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let remainingAccounts = call.remainingAccounts;
  let squadId = accounts.userStakingAccount;

  for (let index = 0; index < remainingAccounts.length; index += 4) {
    let mint = remainingAccounts[index];
    let squadMint = new SquadMint(squadId.toBase58() + '-' + mint.toBase58());
    squadMint.squad = squadId;
    squadMint.mint = mint;
    squadMint.save();
  }
}

export function handleUnstake(call: UnstakeCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let remainingAccounts = call.remainingAccounts;
  let squadId = accounts.userStakingAccount;

  for (let index = 0; index < remainingAccounts.length; index += 2) {
    // let nftVault = remainingAccounts[index + 1];
    // let mint = nftVault.mint;
    // let squadMintId = squadId.toBase58() + '-' + mint.toBase58();
    // store.remove('SquadMint', squadMintId);
    log.warning('unstake: not implemented yet index({})', [index.toString()]);
  }
}

export function handleLockStake(call: LockStakeCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let userId = accounts.userStakingCounterAccount;
  let user = User.load(userId.toBase58());
  if (!user) {
    user = new User(userId.toBase58());
    user.counter = BigInt.fromI32(0);
  } else {
    user.counter = user.counter.plus(BigInt.fromI32(1));
  }
  user.save();

  let squadId = accounts.userStakingAccount;
  let squad = Squad.load(squadId.toBase58());
  if (squad) {
    log.error('lock stake: squad {} does exist', [squadId.toBase58()]);
    return;
  }

  log.debug('local stake: user({}) squad({})', [
    userId.toBase58(),
    squadId.toBase58(),
  ]);

  squad = new Squad(squadId.toBase58());
  squad.index = user.counter;
  squad.wallet = accounts.nftFromAuthority;
  squad.stakingAt = BigInt.fromU32(call.blockTime); // todo
  squad.stakingPeriod = args.stakingPeriod;
  squad.auryDeposit = args.auryAmount;
  squad.claimedAuryReward = false;
  squad.closed = false;
  squad.save();
}

export function handleAddReward(call: AddRewardCall): void {
  let args = call.args;

  for (let index = 0; index < args.nftMintKeys.length; index++) {
    let mint = args.nftMintKeys[index];
    let rewardMint = AvailableRewardMint.load(mint.toBase58());
    if (!rewardMint) {
      let rewardMint = new AvailableRewardMint(mint.toBase58());
      rewardMint.save();
    } else {
      log.debug('add reward: reward mint {} already exists', [mint.toBase58()]);
    }
  }
}

export function handleRemoveReward(call: RemoveRewardCall): void {
  let remainingAccounts = call.remainingAccounts;

  for (let index = 0; index < remainingAccounts.length; index++) {
    let mint = remainingAccounts[index];
    let rewardMint = AvailableRewardMint.load(mint.toBase58());
    if (rewardMint) {
      store.remove('AvailableRewardMint', mint.toBase58());
    } else {
      log.warning('remove reward: reward mint {} does not exist', [
        mint.toBase58(),
      ]);
    }
  }
}

export function handleAddWinner(call: AddWinnerCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let remainingAccounts = call.remainingAccounts;

  for (let index = 0; index < remainingAccounts.length; index += 2) {
    let mint = remainingAccounts[index];
    let squadId = remainingAccounts[index + 1];
    let squadRewardId = squadId.toBase58() + '-' + mint.toBase58();
    let squadReward = SquadReward.load(squadRewardId);
    if (squadReward) {
      squadReward.amount = squadReward.amount.plus(BigInt.fromI32(1));
    } else {
      squadReward = new SquadReward(squadRewardId);
      squadReward.squad = squadId;
      squadReward.mint = mint;
      squadReward.amount = BigInt.fromI32(1);
      squadReward.claimed = false;
    }
    squadReward.save();
  }
}

export function handleAddAuryWinner(call: AddAuryWinnerCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let remainingAccounts = call.remainingAccounts;

  for (let index = 0; index < remainingAccounts.length; index++) {
    let squadId = remainingAccounts[index];
    let squad = Squad.load(squadId.toBase58());
    if (!squad) {
      log.error('Add aury winner: squad {} does not exist', [
        squadId.toBase58(),
      ]);
      return;
    }
    squad.claimableAuryAmount = squad.claimableAuryAmount.plus(
      BigInt.fromI32(1)
    );
    squad.save();
  }
}

export function handleClaim(call: ClaimCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let remainingAccounts = call.remainingAccounts;
  let squadId = accounts.userStakingAccount;

  for (let index = 0; index < remainingAccounts.length; index += 2) {
    let mint = remainingAccounts[index];
    let squadRewardId = squadId.toBase58() + '-' + mint.toBase58();
    let squadReward = SquadReward.load(squadRewardId);
    if (!squadReward) {
      log.error('claim: squad reward {} does not exist', [squadRewardId]);
      return;
    }
    squadReward.claimed = true;
    squadReward.save();
  }
}

export function handleClaimAuryReward(call: ClaimAuryRewardCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let squadId = accounts.userStakingAccount;
  let squad = Squad.load(squadId.toBase58());
  if (!squad) {
    log.error('claim aury: squad {} does not exist', [squadId.toBase58()]);
    return;
  }

  squad.claimedAuryReward = true;
  squad.save();
}

export function handleCloseUserStaking(call: CloseUserStakingCall): void {
  let args = call.args;
  let accounts = call.accounts;

  let squadId = accounts.userStakingAccount;
  let squad = Squad.load(squadId.toBase58());
  if (!squad) {
    log.error('close squad: squad {} does not exist', [squadId.toBase58()]);
    return;
  }

  squad.closed = true;
  squad.save();
}
