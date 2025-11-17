# ERC721合约部署说明

## 重要提示

当前项目中的ERC721合约部署功能需要实际的合约字节码才能正常工作。

## 如何获取合约字节码

### 方法1：使用OpenZeppelin合约

1. 安装OpenZeppelin合约库：
```bash
npm install @openzeppelin/contracts
```

2. 创建Solidity合约文件（例如 `contracts/MyERC721.sol`）：
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract MyERC721 is ERC721, ERC721Burnable, Ownable, ERC2981 {
    string private _baseTokenURI;
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address royaltyRecipient,
        uint96 royaltyFeeBps,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _setDefaultRoyalty(royaltyRecipient, royaltyFeeBps);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        // 实现自定义tokenURI逻辑
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

3. 使用Hardhat或Foundry编译合约

4. 将编译后的字节码复制到 `src/contracts/erc721/bytecode.ts` 文件中

### 方法2：使用合约工厂模式

部署一个工厂合约，通过工厂合约来创建新的ERC721实例。这样可以避免在前端存储大量字节码。

## 环境变量配置

在 `.env.development` 和 `.env.production` 文件中添加：

```bash
# Infura IPFS配置
VITE_INFURA_IPFS_PROJECT_ID=your_infura_ipfs_project_id
VITE_INFURA_IPFS_SECRET=your_infura_ipfs_secret
```

## 当前功能状态

- ✅ NFT创建页面UI
- ✅ IPFS上传功能（需要配置Infura IPFS凭证）
- ✅ 表单验证和步骤流程
- ⚠️ 合约部署功能（需要添加实际字节码）

## 下一步

1. 编译ERC721合约并获取字节码
2. 将字节码添加到 `src/contracts/erc721/bytecode.ts`
3. 配置Infura IPFS凭证
4. 测试完整的创建流程

