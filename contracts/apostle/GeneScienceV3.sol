pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../common/interfaces/ISettingsRegistry.sol";
import "../common/SettingIds.sol";
import "./interfaces/ILandBase.sol";

// this is for breeding new apostles
contract GeneScienceV3 is SettingIds {

    using SafeMath for *;

    bytes32 public constant CONTRACT_GENE_SCIENCE = "CONTRACT_GENE_SCIENCE";
    /*** STORAGE ***/
    bool private singletonLock = false;

    uint256 constant randomBase = 20;

    uint256 constant basicPotential = 60;

    ISettingsRegistry public registry;

    /*
   *  Modifiers
   */
//    modifier singletonLockCall() {
//        require(!singletonLock, "Only can call once");
//        _;
//        singletonLock = true;
//    }

    // for apostle's talents
    // 0-1: gold
    // 2-3: wood
    // 4-5: water
    // 6-7: fire
    // 8-9: soil
    // 10-11: secret1
    // 12-13: secret2
    // 14-15: secret3
    // each value stands for its level
    constructor (ISettingsRegistry _registry) public  {
        registry = _registry;
    }


    function mixGenes(uint256 _mgenes, uint256 _sgenes) public view returns (uint256 babyGenes) {
        (babyGenes,) =  _mixGenes(_mgenes, _sgenes);
        return babyGenes;
    }

    function _mixGenes(
        uint256 _mgenes,
        uint256 _sgenes
    )
    internal view returns (uint256, uint256) {
        uint[12] memory mGenes;
        uint[12] memory sGenes;

        uint[12] memory bGenes;

        uint256 babyGenes;

        uint256 mutationMultiplier;

        // put it here for preventing users to decode genes.
        // parents must be from same race and have different genders.
        // 242-423: race
        // 241: gender
        // 240: ability to breed
        require(_mgenes >> 242 == _sgenes >> 242 && _mgenes >> 241 != _sgenes >> 241, "they cant have babies");

        // define baby's gender, race and ability to have offspring.
        babyGenes = _mgenes & (0xffff << 240);
        if (random(57) < randomBase / 2) {
            babyGenes = _sgenes & (0xffff << 240);
        }

        // define attributes
        for (uint i = 0; i < 12; i++) {
            uint singleMultiplier;
            // mGenes[i] and sGenes[i] stand for 20-bit attribute
            mGenes[i] = (_mgenes >> (20 * i)) & 0xfffff;
            sGenes[i] = (_sgenes >> (20 * i)) & 0xfffff;

            (bGenes[i], singleMultiplier) = _operateAttributes(mGenes[i], sGenes[i], i);

            mutationMultiplier += singleMultiplier;

            babyGenes += bGenes[i] << (20 * i);
        }


        return (babyGenes, mutationMultiplier);

    }

    // _mAttr is 20-bit, so is _sAttr

    function _operateAttributes(uint _mAttr, uint _sAttr, uint256 _index) internal view returns (uint babyTraits, uint mutationMultiplier){
        uint[4] memory mtrait;
        uint[4] memory strait;
        uint[4] memory btrait;

        // mtrait[0] is D0
        for (uint i = 0; i < 4; i++) {
            mtrait[i] = (_mAttr >> (5 * i)) & 0x1f;
            strait[i] = (_sAttr >> (5 * i)) & 0x1f;
        }

        for (uint j = 3; j > 0; j--) {
            uint swap;
            if (random(_index + j * j * 31) < (randomBase / 4)) {
                // swap genes values
                swap = mtrait[j - 1];
                mtrait[j - 1] = mtrait[j];
                mtrait[j] = swap;
            }

            // operations of mgenes and sgenes are individual ones
            if (random(_index + j  * j * 37) >= (randomBase * 3 / 4)) {
                swap = strait[j - 1];
                strait[j - 1] = strait[j];
                strait[j] = swap;
            }

            btrait[j] = random(_index + j *j * 39) < (randomBase / 2) ? mtrait[j] : strait[j];

            babyTraits += (btrait[j] << (5 * j));
        }


        uint trait1 = mtrait[0] > strait[0] ? mtrait[0] : strait[0];
        uint trait2 = mtrait[0] < strait[0] ? mtrait[0] : strait[0];

        if ((trait1 - trait2 == 1) && (trait2 % 2 == 0)) {
            uint mutProb = trait1 > 16 ? (randomBase / 4) : (randomBase / 8);
            if (random(11) < mutProb) {
                // Mutate!
                btrait[0] = (trait2 / 2) + 16;
                if (btrait[0] > 15) {
                    mutationMultiplier += 1;
                } else if (btrait[0] > 23) {
                    mutationMultiplier += 2;
                } else if (btrait[0] > 27) {
                    mutationMultiplier += 3;
                } else if (btrait[0] > 29) {
                    mutationMultiplier += 4;
                }

            }
        } else {
            btrait[0] = random(_index * 43 + 61) < (randomBase / 2) ? mtrait[0] : strait[0];
        }

        babyTraits += btrait[0];


        if (_index == 10) {
            mutationMultiplier = mutationMultiplier * 2;
        }


    }

    function mixTalents(
        uint256 _mtalents,
        uint256 _stalents,
        uint256 _mutationMultiplier,
        uint256 _index,
        uint256 _level)
    public view returns (uint256 babyTalents) {

        return _mixTalents(_mtalents, _stalents, _mutationMultiplier, _index, _level);
    }


    function _mixTalents(
        uint256 _mtalents,
        uint256 _stalents,
        uint256 _mutationMultiplier,
        uint256 _index,
        uint256 _level)
    internal view returns (uint256 babyTalents) {
        // mix talents
        uint256 bornPotential = basicPotential + _mutationMultiplier * 8;
        // 130 is the bornPotential's limit
        if (bornPotential > 130) {
            bornPotential = 130;
        }

        uint strength = random(13) % bornPotential;
        if (strength < 5 || strength >= bornPotential * 4 / 5) {
            strength = bornPotential / 3;
        }
        uint agility =  random(41) % (bornPotential - strength - 5);
        if (agility < 5) {
            agility = (bornPotential - strength) / 2;
        }

        // uint intelligence = bornPotential - strength - agility;
        babyTalents = strength + (agility << 8) + ((bornPotential - strength - agility) << 16);


        for (uint k = 3; k < 12; k++) {
            // TODO: if there any relationship between talent
            uint talentSlot = random(k + 19) % bornPotential;

            if(k >= 8 && k <= 10) {
                continue;
            }

            if (k == 3 || k == 4) {

                if (talentSlot < 50) {
                    // apostle's life >= 50 weeks
                    talentSlot = 50;
                }

                if (talentSlot > 65) {
                    talentSlot = 65;
                }

            }

            if (talentSlot == 0) {
                talentSlot = 1;
            }

            babyTalents += (talentSlot << (8 * k));
        }

        babyTalents += (bornPotential << 64);

        uint prefer = calculatePrefer(_mtalents, _stalents, _index, _level);

        babyTalents += ((prefer & (0xffff)) << 72);

    }

    function calculatePrefer(uint _mtalents, uint _stalents, uint _index, uint _level) public view returns (uint prefer) {
        prefer = (_mtalents >> 72) & 0xffff;
        uint seed1 = random(51);
        if (seed1 >= randomBase * 2 / 5 && seed1 < randomBase *4/5) {
            prefer = (_stalents >> 72) & 0xffff;
        } else if (seed1 < randomBase * 9 / 10) {
            prefer = 0;
        } else {
            prefer |= ((_stalents >> 72) & 0xffff);
        }

        if (_index > 0 && _level > 0) {
            if (_level < 3) {
                if (random(23) < randomBase / 2) {
                    prefer |= (_level << (2 * (_index - 1)));
                } else {
                    prefer |= ((_level - 1) << (2 * (_index - 1)));
                }
            } else if (_level == 3) {
                uint rand = random(29);
                if (rand < randomBase / 4) {
                    prefer |= (1 << (2 * (_index - 1)));
                } else if (rand < randomBase * 3 / 4) {
                    prefer |= (2 << (2 * (_index - 1)));
                } else {
                    prefer |= (3 << (2 * (_index - 1)));
                }
            }
        }
    }


    function mixGenesAndTalents(
        uint256 _mgenes,
        uint256 _sgenes,
        uint256 _mtalents,
        uint256 _stalents,
        address _resourceToken,
        uint256 _level)
    public view returns (uint256 babyGenes, uint babyTalents) {
        uint mutationMultiplier;
        uint index = ILandBase(registry.addressOf(SettingIds.CONTRACT_LAND_BASE)).resourceToken2RateAttrId(_resourceToken);

        (babyGenes, mutationMultiplier) = _mixGenes(_mgenes, _sgenes);

        babyTalents = _mixTalents(_mtalents, _stalents, mutationMultiplier, index, _level);

    }



    // only calculate born talents
    function getStrength(uint256 _talents, address _resourceToken, uint256 _landTokenId) public view returns (uint256 miningStrength) {
        uint potential = (_talents & (0xff << 64)) >> 64;
        uint strength = _talents & 0xff;
        uint agility = (_talents & (0xff << 8)) >> 8;

        // for low potential, denominator is 7 * potential
        // for high potential which >= 100, denominator is 8 * potential
        // we try to pursue balance between low and high potentials.
        uint miningStrengthBasic = strength * agility * (1 * 10**18) / ((7 + potential / 100) * potential);

        uint index = ILandBase(registry.addressOf(SettingIds.CONTRACT_LAND_BASE)).resourceToken2RateAttrId(_resourceToken);
        uint prefer = (((_talents >> 72) & 0xffff) & (3 << (2 * (index - 1)))) >> (2 * (index - 1));
        require(prefer <= 3);

        // prefer = 0  => miningStrength = miningStrengthBasic
        // prefer = 1  => miningStrength = 1.05 * miningStrengthBasic
        // prefer = 2  => miningStrength = 1.10 * miningStrengthBasic
        // prefer = 3 => miningStrength = 1.20 * miningStrengthBasic
        miningStrength = miningStrengthBasic + miningStrengthBasic * 5 * prefer / 100;
        if (prefer == 3) {
            miningStrength += (miningStrengthBasic * 5 / 100);
        }

        uint landLevel = getLandLevel(_landTokenId);
        miningStrength = (miningStrength * (100 + 3 * landLevel) / 100);

        return miningStrength;
    }

    function getLandLevel(uint256 _landTokenId) public view returns (uint256) {
        uint gold = ILandBase(registry.addressOf(CONTRACT_LAND_BASE)).getResourceRate(_landTokenId, registry.addressOf(CONTRACT_GOLD_ERC20_TOKEN));
        uint wood = ILandBase(registry.addressOf(CONTRACT_LAND_BASE)).getResourceRate(_landTokenId, registry.addressOf(CONTRACT_WOOD_ERC20_TOKEN));
        uint water = ILandBase(registry.addressOf(CONTRACT_LAND_BASE)).getResourceRate(_landTokenId, registry.addressOf(CONTRACT_WATER_ERC20_TOKEN));
        uint fire = ILandBase(registry.addressOf(CONTRACT_LAND_BASE)).getResourceRate(_landTokenId, registry.addressOf(CONTRACT_FIRE_ERC20_TOKEN));
        uint soil = ILandBase(registry.addressOf(CONTRACT_LAND_BASE)).getResourceRate(_landTokenId, registry.addressOf(CONTRACT_SOIL_ERC20_TOKEN));

        uint total = gold + wood + water + fire + soil;
        return (total / 60 + total / 100);
    }


    function isOkWithRaceAndGender(uint _mgenes, uint _sgenes) public view returns (bool) {
        bool ok = (_mgenes >> 242 == _sgenes >> 242) && (_mgenes >> 241 != _sgenes >> 241);
        return ok;
    }



    function random(uint _multiplier) public view returns (uint256) {

        uint256 seed = uint256(keccak256(abi.encodePacked(
                (block.timestamp).add
                (block.difficulty).add
                ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (now)).add
                (block.gaslimit).add
                ((uint256(keccak256(abi.encodePacked(tx.origin)))) / (now)).add
                (block.number)
            )));

        seed = _uniform(seed, 0, _multiplier);

        return (seed % randomBase);
    }

    function _uniform(uint256 _seed, uint256 _min, uint256 _max) internal returns (uint256) {
        uint256 seed = (2045 * _seed + 1) * 10**8;
        seed = seed - (seed / 1048576) * 1048576;
        uint256 t = seed / 1048576;
        t = _min + (_max + _min) * t;
        return t;
    }

}
