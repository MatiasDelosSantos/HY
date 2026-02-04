VERSION 5.00
Object = "{00025600-0000-0000-C000-000000000046}#5.2#0"; "Crystl32.OCX"
Begin VB.Form frmlistado 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Listado"
   ClientHeight    =   5445
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   9090
   LinkTopic       =   "Form1"
   ScaleHeight     =   5445
   ScaleWidth      =   9090
   StartUpPosition =   2  'CenterScreen
   Begin VB.OptionButton optG 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Gremio"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   3120
      TabIndex        =   8
      Top             =   1080
      Width           =   1455
   End
   Begin VB.OptionButton optpu 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Publico"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   360
      TabIndex        =   7
      Top             =   1080
      Width           =   1695
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   6120
      Picture         =   "frmlistado.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   3
      Top             =   3600
      Width           =   1575
   End
   Begin VB.ComboBox Combo1 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Left            =   120
      TabIndex        =   2
      Top             =   2280
      Width           =   2655
   End
   Begin VB.ComboBox Combo2 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Left            =   3240
      TabIndex        =   1
      Top             =   2280
      Width           =   2535
   End
   Begin VB.CommandButton cmdbuscar 
      BackColor       =   &H0080FF80&
      Caption         =   "Buscar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   6120
      Picture         =   "frmlistado.frx":2982
      Style           =   1  'Graphical
      TabIndex        =   0
      Top             =   2280
      Width           =   1575
   End
   Begin Crystal.CrystalReport informe1 
      Left            =   2880
      Top             =   4080
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   348160
      WindowControlBox=   -1  'True
      WindowMaxButton =   -1  'True
      WindowMinButton =   -1  'True
      PrinterCollation=   0
      WindowState     =   2
      PrintFileLinesPerPage=   60
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Seleccionar Marca"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   570
      Left            =   2040
      TabIndex        =   6
      Top             =   0
      Width           =   3480
   End
   Begin VB.Label Label3 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Desde :"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   495
      Left            =   840
      TabIndex        =   5
      Top             =   1800
      Width           =   1245
   End
   Begin VB.Label Label4 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Hasta : "
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   495
      Left            =   4080
      TabIndex        =   4
      Top             =   1800
      Width           =   1275
   End
End
Attribute VB_Name = "frmlistado"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdsalir_Click()
Unload Me

End Sub

Private Sub cmdBuscar_Click()
If Combo1.ListIndex <= Combo2.ListIndex Then
    
    If optpu.Value = True Then
        informe1.ReportFileName = App.Path & "\ArticulosP.rpt"
        informe1.SelectionFormula = "{articulos.Marca} in '" & Combo1.Text & "' to '" & Combo2.Text & "'"
        informe1.Action = 1
    ElseIf optG.Value = True Then
        informe1.ReportFileName = App.Path & "\ArticulosG.rpt"
        informe1.SelectionFormula = "{articulos.Marca} in '" & Combo1.Text & "' to '" & Combo2.Text & "'"
        informe1.Action = 1
    End If
Else
    MsgBox "el hasta nunca debe superar el desde"
End If


End Sub

Private Sub Form_Activate()
optpu.SetFocus
End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set miRecor = miBase.OpenRecordset("select Marca from Articulos group by Marca", dbOpenDynaset)
If miRecor.RecordCount > 0 Then
    miRecor.MoveFirst
    Do While Not miRecor.EOF
        If Not IsNull(miRecor!marca) Then
            Combo1.AddItem miRecor!marca
            Combo2.AddItem miRecor!marca
        End If
        miRecor.MoveNext
    Loop
    If Combo1.ListCount > 0 Then
        Combo1.ListIndex = 0
        Combo2.ListIndex = Combo2.ListCount - 1
    End If
End If
    miRecor.Close

End Sub

