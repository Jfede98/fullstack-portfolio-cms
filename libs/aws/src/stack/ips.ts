const proveedores = [
  {
    port: 22,
    ips: [
      { cidr: "190.110.46.174/32", label: "Harness" },
      { cidr: "52.4.93.75/32", label: "Bastion Datha" }
    ]
  }
];

const comercialTeamInside = [
  {
    port: 443,
    ips: [
      { cidr: "0.0.0.0/0", label: "all world" },
    ]
  }
];


export const ipList = {
  proveedores,
  comercialTeamInside,
};
