{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "asteria.cat";

  buildInputs = [ # This literally exists just because i cba to install these globally
    pkgs.nodejs_20 
    pkgs.pnpm
  ];

  shellHook = ''
    export NODE_OPTIONS="--max_old_space_size=4096"
    echo "Boop!"
    echo "Run pnpm build-docs && pnpm i && pnpm dev"
  '';
}
