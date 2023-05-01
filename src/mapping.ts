import { BigInt, log } from '@anchor-indexer/ts';
import { StakeCall } from '../generated/AOE/AOE';
import { Squad } from '../generated/schema';

export { StakeCall } from '../generated/AOE/AOE';
export { Squad } from '../generated/schema';

export function handleStake(call: StakeCall): void {
  let args = call.args;
  let accounts = call.accounts;
  let id = accounts.userStakingCounterAccount.toBase58();
  let squad = Squad.load(id);
  if (squad) {
    log.warning('create squad: squad {} already exists', [id]);
  } else {
    log.debug('create squad {}', [id]);
    squad = new Squad(id.toBase58());
    squad.mint = accounts.mint;
    squad.seller = accounts.payer;
    squad.destination = args.destination;
    squad.quantity = args.quantity;
    squad.price = args.price;
    squad.status = 'Listed';
    let blockTime = BigInt.fromU32(call.blockTime);
    squad.createdAt = blockTime;
    squad.updatedAt = blockTime;
    squad.save();
  }
}
