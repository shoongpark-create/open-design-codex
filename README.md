# open-design-codex — archived

> **이 리포는 2026-05 모노레포 통합으로 archive 상태입니다.**
>
> Codex CLI 마운트는 더 이상 별도 리포가 아닙니다. [`shoongpark-create/open-design`](https://github.com/shoongpark-create/open-design)의 `setup.sh`가 클론 1회로 Claude Code와 Codex CLI 양쪽 마운트를 자동으로 만들어줍니다.

## Migration

| 이전 위치 | 새 위치 |
|---|---|
| `open-design-codex/skills.manifest.json` | (제거됨 — `open-design/setup.sh`가 대체) |
| `open-design-codex/scripts/link.mjs` | (제거됨 — `open-design/setup.sh`가 대체) |

이 리포는 콘텐츠 없이 manifest + 심링크 생성 스크립트만 보유했습니다. 모노레포에서는 같은 역할을 `open-design/setup.sh`(Mac/Linux) + `open-design/setup.ps1`(Windows)가 수행합니다.

## 팀 사용

```bash
git clone https://github.com/shoongpark-create/open-design.git
cd open-design
./setup.sh
```

이 한 번이면:
- `~/.claude/skills/` 마운트에 75개 스킬 심링크 생성
- `~/.codex/skills/` 마운트에 동일 스킬 심링크 생성
- Windows 사용자는 `.\setup.ps1` 실행 (junction 사용)

## 히스토리

이 리포의 git history는 그대로 보존됩니다. 새 커밋은 받지 않으며, 모든 신규 기여는 [`open-design`](https://github.com/shoongpark-create/open-design)에 해주세요.
